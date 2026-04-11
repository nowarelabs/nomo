import { DurableObject } from "cloudflare:workers";
import { drizzle, type DrizzleSqliteDODatabase } from "drizzle-orm/durable-sqlite";

import { DurableObjectBaseDelegate } from "./delegate";
import { PopulateDelegate, PopulateConfig } from "./delegates/populate";
import { ViewDelegate, ViewConfig } from "./delegates/view";
import { CheckDelegate, CheckConfig } from "./delegates/check";
import { QueueDelegate, QueueConfig } from "./delegates/queue";
import { ExecutionDelegate, ExecutionConfig } from "./delegates/execution";
import { SearchDelegate, SearchConfig } from "./delegates/search";
import { LockDelegate, LockConfig } from "./delegates/lock";
import { LogDelegate, LogConfig } from "./delegates/log";
import { LogicDelegate, LogicConfig } from "./delegates/logic";
import { ConfigDelegate, ConfigOptions } from "./delegates/config";

export interface Env {
  [key: string]: unknown;
}

export class BaseDurableObject extends DurableObject {
  storage: DurableObjectStorage;
  db: DrizzleSqliteDODatabase<Env>;
  protected delegates: Map<string, DurableObjectBaseDelegate> = new Map();

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
    this.storage = ctx.storage;
    this.db = drizzle(this.storage, { logger: false });
  }

  /**
   * Register a delegate for a specific pattern.
   * If the delegate defines a name, it will be attached to the DO instance for RPC.
   */
  protected use<TConfig>(
    name: string,
    delegateClass: new (owner: BaseDurableObject, config: TConfig) => DurableObjectBaseDelegate,
    config: TConfig,
  ): DurableObjectBaseDelegate {
    const delegate = new delegateClass(this, config as never);
    this.delegates.set(name, delegate);

    (this as Record<string, unknown>)[name] = (...args: unknown[]) =>
      (delegate as { handle: (...args: unknown[]) => unknown }).handle(...args);

    if (delegate.onInit) {
      delegate.onInit();
    }

    return delegate;
  }

  protected is_view(config: ViewConfig) {
    return this.use<ViewConfig>("view", ViewDelegate as never, config);
  }

  protected can_populate(config: PopulateConfig) {
    return this.use<PopulateConfig>("populate", PopulateDelegate as never, config);
  }

  protected is_queue(config: QueueConfig) {
    return this.use<QueueConfig>("queue", QueueDelegate as never, config);
  }

  protected is_check(config: CheckConfig) {
    return this.use<CheckConfig>("check", CheckDelegate as never, config);
  }

  protected is_sequential(config: ExecutionConfig) {
    return this.use("sequential", ExecutionDelegate as never, { ...config, mode: "sequential" });
  }

  protected is_parallel(config: ExecutionConfig) {
    return this.use("parallel", ExecutionDelegate as never, { ...config, mode: "parallel" });
  }

  protected is_search(config: SearchConfig) {
    return this.use<SearchConfig>("search", SearchDelegate as never, config);
  }

  protected is_lock(config: LockConfig) {
    return this.use<LockConfig>("lock", LockDelegate as never, config);
  }

  protected is_event_log(config: LogConfig) {
    return this.use<LogConfig>("event_log", LogDelegate as never, config);
  }

  protected is_calculate(config: LogicConfig) {
    return this.use<LogicConfig>("calculate", LogicDelegate as never, config);
  }

  protected is_trigger(config: LogicConfig) {
    return this.use<LogicConfig>("trigger", LogicDelegate as never, config);
  }

  protected is_auto_log(config: LogConfig) {
    return this.use("auto_log", LogDelegate as never, { ...config, autoLog: true });
  }

  protected is_adapter(config: ConfigOptions) {
    return this.use<ConfigOptions>("adapter", ConfigDelegate as never, config);
  }

  protected is_furnish(config: ConfigOptions) {
    return this.use<ConfigOptions>("furnish", ConfigDelegate as never, config);
  }

  protected is_decision_matrix(config: LogicConfig) {
    return this.use<LogicConfig>("decision_matrix", LogicDelegate as never, config);
  }

  protected is_configure(config: ConfigOptions) {
    return this.use<ConfigOptions>("configure", ConfigDelegate as never, config);
  }

  protected is_paginate(config: SearchConfig) {
    return this.use<SearchConfig>("paginate", SearchDelegate as never, config);
  }

  async execSql(sqlText: string) {
    return await this.storage.sql.exec(sqlText).toArray();
  }

  async clear(table: string | { name: string }): Promise<void> {
    const tableName = typeof table === "string" ? table : table.name;
    await this.storage.sql.exec(`DELETE FROM ${tableName}`);
  }

  async insertBatch<T extends Record<string, unknown>>(
    table: string | { name: string },
    records: T[],
  ): Promise<number> {
    if (!records?.length) return 0;

    const tableName = typeof table === "string" ? table : table.name;
    const columns = Object.keys(records[0]);
    const placeholders = records
      .map((_, i) => `(${columns.map((_, j) => `$${i * columns.length + j + 1}`).join(", ")})`)
      .join(", ");

    const values = records.flatMap((r) => columns.map((c) => r[c]));

    const sql = `INSERT INTO ${tableName} (${columns.join(", ")}) VALUES ${placeholders}`;
    await this.storage.sql.exec(sql, values);

    return records.length;
  }
}
