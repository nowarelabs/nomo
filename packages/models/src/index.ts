/**
 * noware-models - BaseModel with Drizzle ORM
 * 
 * Standard Gauge: Model layer (M in RCSM)
 * 
 * Connection Flow:
 * BaseService → BaseModel → BasePersistence
 * 
 * Connection: This layer → BasePersistence (RCSM - ONE call only)
 */

import { getTableName } from "drizzle-orm";
import { sqliteTable, SQLiteTableWithColumns } from "drizzle-orm/sqlite-core";
import { Statement, sql, DialectStrategy, getDialectStrategy, SqlPart } from "../sql/index.ts";
import { Logger } from "../logger/index.ts";
import { ConflictError, ConstraintError, BadRequestError, RouterContext } from "../router/index.ts";

import type { ExecutionContext, D1Database, DurableObjectStorage } from "@cloudflare/workers-types";

interface D1Db {
  prepare(sql: string): {
    all: () => Promise<{ results?: unknown[]; success?: boolean; data?: unknown }>;
  };
}

interface DoStorage {
  exec(sql: string): { toArray: () => unknown[] };
}

interface RpcDb {
  execSql(sql: string): Promise<unknown[]>;
}

interface ModelAccess {
  [modelName: string]: {
    where?: (conds: unknown) => {
      all: () => Promise<unknown[]>;
      pluck: (col: string) => Promise<unknown[]>;
    };
    all?: () => Promise<unknown[]>;
    pluck?: (col: string) => Promise<unknown[]>;
  };
}

export type DatabaseInstance =
  | (D1Database & D1Db)
  | (DurableObjectStorage & DoStorage)
  | (RpcDb & ModelAccess);

export class FluentQuery<
  TTable extends SQLiteTableWithColumns<any>,
  TSelect extends Record<string, any> = TTable["$inferSelect"],
> {
  private stmt: Statement;
  private strategy: DialectStrategy;
  private selection: SqlPart[] = [];
  private whereClauses: SqlPart[] = [];
  private orderClauses: SqlPart[] = [];
  private joinClauses: SqlPart[] = [];
  private limitCount?: number;
  private offsetCount?: number;
  private loadWith: string[] = [];
  private loadStrategy: "separate_queries" | "joins" | "auto" = "auto";
  private relationships: Record<string, RelationshipMetadata> = {};

  constructor(
    private db: DatabaseInstance,
    private table: TTable,
    private logger?: Logger,
    dialect: "sqlite" | "postgres" | "mysql" = "sqlite",
  ) {
    this.strategy = getDialectStrategy(dialect);
    this.stmt = sql.statement();
  }

  setRelationships(rels: Record<string, RelationshipMetadata>): this {
    this.relationships = rels;
    return this;
  }

  select(...columns: (keyof TSelect | "*")[]): this {
    if (columns.includes("*")) {
      this.selection = [sql.raw("*")];
    } else {
      this.selection = columns.map((c) => sql.id(String(c)));
    }
    return this;
  }

  join(table: SQLiteTableWithColumns<any>, on: string): this {
    const tableName = getTableName(table);
    this.joinClauses.push(
      sql.composite(sql.key(" JOIN "), sql.id(tableName), sql.key(" ON "), sql.raw(on)),
    );
    return this;
  }

  where(conditions: Record<string, unknown> | SqlPart): this {
    if (conditions instanceof SqlPart) {
      this.whereClauses.push(conditions);
    } else {
      const parts = Object.entries(conditions).map(([k, v]) => {
        if (v !== null && typeof v === "object" && "neq" in v) {
          return sql.composite(sql.id(k), sql.op(" IS NOT "), sql.val(v.neq));
        }
        if (v !== null && typeof v === "object" && "eq" in v) {
          return sql.composite(sql.id(k), sql.op(" = "), sql.val(v.eq));
        }
        if (v !== null && typeof v === "object" && "gt" in v) {
          return sql.composite(sql.id(k), sql.op(" > "), sql.val(v.gt));
        }
        if (v !== null && typeof v === "object" && "gte" in v) {
          return sql.composite(sql.id(k), sql.op(" >= "), sql.val(v.gte));
        }
        if (v !== null && typeof v === "object" && "lt" in v) {
          return sql.composite(sql.id(k), sql.op(" < "), sql.val(v.lt));
        }
        if (v !== null && typeof v === "object" && "lte" in v) {
          return sql.composite(sql.id(k), sql.op(" <= "), sql.val(v.lte));
        }
        if (v !== null && typeof v === "object" && "like" in v) {
          return sql.composite(sql.id(k), sql.op(" LIKE "), sql.val(v.like));
        }
        if (v !== null && typeof v === "object" && "in" in v && Array.isArray(v.in)) {
          const values = v.in
            .map((val: unknown) => {
              if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`;
              if (val === null || val === undefined) return "NULL";
              return String(val);
            })
            .join(", ");
          return sql.composite(sql.id(k), sql.op(" IN ("), sql.raw(values), sql.op(")"));
        }
        if (v !== null && typeof v === "object" && "nin" in v && Array.isArray(v.nin)) {
          const values = v.nin
            .map((val: unknown) => {
              if (typeof val === "string") return `'${val.replace(/'/g, "''")}'`;
              if (val === null || val === undefined) return "NULL";
              return String(val);
            })
            .join(", ");
          return sql.composite(sql.id(k), sql.op(" NOT IN ("), sql.raw(values), sql.op(")"));
        }
        if (v === null) {
          return sql.composite(sql.id(k), sql.op(" IS NULL"));
        }
        return sql.composite(sql.id(k), sql.op(" = "), sql.val(v));
      });
      this.whereClauses.push(...parts);
    }
    return this;
  }

  orderBy(column: keyof TSelect, direction: "ASC" | "DESC" = "ASC"): this {
    this.orderClauses.push(sql.composite(sql.id(String(column)), sql.key(" "), sql.key(direction)));
    return this;
  }

  limit(n: number): this {
    this.limitCount = n;
    return this;
  }

  offset(n: number): this {
    this.offsetCount = n;
    return this;
  }

  with(...relations: string[]): this {
    this.loadWith = relations;
    this.loadStrategy = "auto";
    return this;
  }

  withJoins(...relations: string[]): this {
    this.loadWith = relations;
    this.loadStrategy = "joins";
    return this;
  }

  withSeparateQueries(...relations: string[]): this {
    this.loadWith = relations;
    this.loadStrategy = "separate_queries";
    return this;
  }

  selectColumnValues<K extends keyof TSelect>(column: K): Promise<TSelect[K][]> {
    return this.pluck(column);
  }

  private build(): Statement {
    const tableName = getTableName(this.table);
    const s = sql.statement();

    // SELECT
    s.append(sql.key("SELECT "));

    // When using joins, we need to prefix columns to avoid ambiguity
    if (this.loadStrategy === "joins" && this.loadWith.length > 0) {
      const selectParts: SqlPart[] = [sql.id(tableName), sql.op(".*")];
      for (const relName of this.loadWith) {
        const rel = this.relationships[relName];
        if (rel) {
          selectParts.push(sql.composite(sql.id(rel.model), sql.op(".*")));
        }
      }
      s.append(sql.join(selectParts, sql.op(", ")));
    } else if (this.selection.length > 0) {
      s.append(sql.join(this.selection, sql.op(", ")));
    } else {
      s.append(sql.raw("*"));
    }

    // FROM
    s.append(sql.nl(), sql.key("FROM "), sql.id(tableName));

    // JOIN
    if (this.joinClauses.length > 0) {
      this.joinClauses.forEach((j) => s.append(sql.nl(), j));
    }

    // Auto-generate JOINs for eager loading
    if (this.loadStrategy === "joins" && this.loadWith.length > 0) {
      for (const relName of this.loadWith) {
        const rel = this.relationships[relName];
        if (!rel) continue;

        const relTableName = rel.model;
        const fk = rel.foreignKey || `${relName}_id`;
        const pk = rel.type === "belongs_to" ? `${relTableName}_id` : "id";

        s.append(sql.nl());
        s.append(
          sql.composite(
            sql.key("LEFT JOIN "),
            sql.id(relTableName),
            sql.key(" ON "),
            sql.composite(
              sql.id(tableName),
              sql.op("."),
              sql.id(fk),
              sql.op(" = "),
              sql.id(relTableName),
              sql.op("."),
              sql.id(pk),
            ),
          ),
        );
      }
    }

    // WHERE
    if (this.whereClauses.length > 0) {
      s.append(sql.nl(), sql.key("WHERE "));
      s.append(sql.join(this.whereClauses, sql.op(" AND ")));
    }

    // ORDER BY
    if (this.orderClauses.length > 0) {
      s.append(sql.nl(), sql.key("ORDER BY "));
      s.append(sql.join(this.orderClauses, sql.op(", ")));
    }

    // LIMIT
    if (this.limitCount !== undefined) {
      s.append(sql.nl(), sql.key("LIMIT "), sql.raw(String(this.limitCount)));
    }

    // OFFSET
    if (this.offsetCount !== undefined) {
      s.append(sql.nl(), sql.key("OFFSET "), sql.raw(String(this.offsetCount)));
    }

    return s;
  }

  async all(): Promise<TSelect[]> {
    const tableName = getTableName(this.table);
    const finalStmt = this.build();
    const sqlRes = finalStmt.toSql(this.strategy);
    if (!sqlRes.success) throw new Error(sqlRes.message);
    const sqlText = sqlRes.data.value;
    const start = Date.now();
    this.logger?.debug(`[QUERY] ${sqlText}`);

    const results = await this.executeQuery<TSelect[]>(sqlText);

    // Eager load relations
    if (this.loadWith.length > 0 && results.length > 0) {
      return await this.loadRelations(results);
    }

    this.logger?.debug(
      `[QUERY RESULT] ${tableName} count=${results.length} duration_ms=${Date.now() - start}`,
    );
    return results;
  }

  private async executeQuery<T>(sqlText: string): Promise<T> {
    const db = this.db;

    if ("execSql" in db) {
      return (await (db as RpcDb).execSql(sqlText)) as T;
    }

    if ("prepare" in db) {
      const stmt = (db as D1Database & D1Db).prepare(sqlText);
      const res = await stmt.all();
      return (res.results || res) as T;
    }

    if ("exec" in db) {
      return (db as DurableObjectStorage & DoStorage).exec(sqlText).toArray() as T;
    }

    throw new Error("No database driver available");
  }

  private async loadRelations(results: TSelect[]): Promise<TSelect[]> {
    for (const relationName of this.loadWith) {
      const rel = this.relationships[relationName];
      if (!rel) {
        this.logger?.debug(`[LOAD] Unknown relation: ${relationName}`);
        continue;
      }

      const foreignKey = rel.foreignKey || `${relationName}_id`;

      if (this.loadStrategy === "joins") {
        const grouped = new Map<string | number, Record<string, any>[]>();
        const relTableName = rel.model;

        for (const row of results) {
          const parentId = row.id as string | number;

          const relColumns: Record<string, any> = {};
          let hasRelatedData = false;

          for (const key of Object.keys(row)) {
            if (key.startsWith(`${relTableName}_`)) {
              const originalKey = key.substring(relTableName.length + 1);
              relColumns[originalKey] = row[key as keyof TSelect];
              if (row[key as keyof TSelect] !== null && row[key as keyof TSelect] !== undefined) {
                hasRelatedData = true;
              }
            }
          }

          if (hasRelatedData) {
            if (!grouped.has(parentId)) grouped.set(parentId, []);
            grouped.get(parentId)!.push(relColumns);
          }
        }

        for (let i = 0; i < results.length; i++) {
          const item = results[i];
          const parentId = item.id as string | number;
          const relationData = grouped.get(parentId) || [];
          results[i] = { ...item, [relationName]: relationData } as TSelect;
        }

        this.logger?.debug(`[LOAD JOIN] ${relationName}`);
      } else {
        const foreignKeys = [
          ...new Set(results.map((r) => r[foreignKey as keyof TSelect]).filter(Boolean)),
        ];

        if (foreignKeys.length === 0) continue;

        const relDb = this.db as DatabaseInstance & { [key: string]: unknown };
        const relTable = relDb[rel.model];
        if (!relTable) {
          this.logger?.warn(`[LOAD] Related model not found: ${rel.model}`);
          continue;
        }

        const relatedResults: unknown[] = [];
        const relQuery = (
          relTable as { where?: (conds: unknown) => { all: () => Promise<unknown[]> } }
        ).where?.({ [foreignKey]: { in: foreignKeys } });

        if (relQuery?.all) {
          relatedResults.push(...(await relQuery.all()));
        }

        const grouped = new Map<string | number, unknown[]>();
        for (const item of relatedResults) {
          const itemRecord = item as Record<string, unknown>;
          const fk = itemRecord[foreignKey];
          if (!grouped.has(fk as string | number)) grouped.set(fk as string | number, []);
          grouped.get(fk as string | number)!.push(item);
        }

        results = results.map((item) => {
          const fk = item[foreignKey as keyof TSelect];
          return { ...item, [relationName]: grouped.get(fk as string | number) || [] } as TSelect;
        });

        this.logger?.debug(`[LOAD PRELOAD] ${relationName} count=${relatedResults.length}`);
      }
    }

    return results;
  }

  async first(): Promise<TSelect | null> {
    const tableName = getTableName(this.table);
    this.logger?.debug(`[FIRST] ${tableName}`);
    this.limit(1);
    const results = await this.all();
    const record = results[0] || null;
    if (record) {
      this.logger?.debug(`[FIRST FOUND] ${tableName}`);
    } else {
      this.logger?.debug(`[FIRST NOT FOUND] ${tableName}`);
    }
    return record;
  }

  async findBy(
    conditions: Record<string, unknown>,
    options?: {
      offset?: number;
    },
  ): Promise<TSelect | null> {
    const tableName = getTableName(this.table);
    this.logger?.debug(`[FIND BY] ${tableName}`, { conditions, options });

    let query = this.where(conditions);

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    return query.first();
  }

  async findAllBy(
    conditions: Record<string, unknown>,
    options?: {
      orderBy?: { column: keyof TSelect; direction?: "ASC" | "DESC" };
      limit?: number;
      offset?: number;
    },
  ): Promise<TSelect[]> {
    const tableName = getTableName(this.table);
    this.logger?.debug(`[FIND ALL BY] ${tableName}`, { conditions, options });

    let query = this.where(conditions);

    if (options?.orderBy) {
      query = query.orderBy(options.orderBy.column, options.orderBy.direction || "ASC");
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    return query.all();
  }

  async count(): Promise<number> {
    const tableName = getTableName(this.table);
    const s = sql.statement([sql.key("SELECT COUNT(*) as count FROM "), sql.id(tableName)]);

    if (this.whereClauses.length > 0) {
      s.append(sql.nl(), sql.key("WHERE "));
      s.append(sql.join(this.whereClauses, sql.op(" AND ")));
    }

    const sqlRes = s.toSql(this.strategy);
    if (!sqlRes.success) throw new Error(sqlRes.message);

    const res = await this.executeQuery<{ count: number }[]>(sqlRes.data.value);
    return res?.[0]?.count || 0;
  }

  async countBy(conditions: Record<string, unknown>): Promise<number> {
    return this.where(conditions).count();
  }

  async findByIds(ids: (string | number)[]): Promise<TSelect[]> {
    if (ids.length === 0) return [];
    return this.where({ id: { in: ids } }).all();
  }

  async firstBy(conditions: Record<string, unknown>): Promise<TSelect | null> {
    return this.where(conditions).first();
  }

  async pluck<K extends keyof TSelect>(column: K): Promise<TSelect[K][]> {
    const tableName = getTableName(this.table);
    const s = sql.statement([
      sql.key("SELECT "),
      sql.id(String(column)),
      sql.key(" FROM "),
      sql.id(tableName),
    ]);

    if (this.whereClauses.length > 0) {
      s.append(sql.nl(), sql.key("WHERE "));
      s.append(sql.join(this.whereClauses, sql.op(" AND ")));
    }

    if (this.orderClauses.length > 0) {
      s.append(sql.nl(), sql.key("ORDER BY "));
      s.append(sql.join(this.orderClauses, sql.op(", ")));
    }

    if (this.limitCount !== undefined) {
      s.append(sql.nl(), sql.key("LIMIT "), sql.raw(String(this.limitCount)));
    }

    if (this.offsetCount !== undefined) {
      s.append(sql.nl(), sql.key("OFFSET "), sql.raw(String(this.offsetCount)));
    }

    const sqlRes = s.toSql(this.strategy);
    if (!sqlRes.success) throw new Error(sqlRes.message);

    const rows = await this.executeQuery<Record<string, TSelect[K]>[]>(sqlRes.data.value);
    return rows.map((row) => row[String(column)]);
  }

  toSql(): string {
    const finalStmt = this.build();
    const res = finalStmt.toSql(this.strategy);
    return res.success ? res.data.value : "";
  }

  clone(): FluentQuery<TTable, TSelect> {
    const cloned = new FluentQuery<TTable, TSelect>(this.db, this.table, this.logger);
    cloned.stmt = sql.statement();
    cloned.selection = [...this.selection];
    cloned.whereClauses = [...this.whereClauses];
    cloned.orderClauses = [...this.orderClauses];
    cloned.joinClauses = [...this.joinClauses];
    cloned.limitCount = this.limitCount;
    cloned.offsetCount = this.offsetCount;
    cloned.loadWith = [...this.loadWith];
    cloned.loadStrategy = this.loadStrategy;
    cloned.relationships = { ...this.relationships };
    return cloned;
  }

  async paginate(params: { page?: number; perPage?: number } = {}): Promise<{
    items: TSelect[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
  }> {
    const perPage = params.perPage ?? 10;
    const total = await this.clone().count();
    const maxPage = Math.max(1, Math.ceil(total / perPage));
    const requestedPage = params.page ?? 1;
    const page = requestedPage > maxPage ? 1 : Math.max(1, requestedPage);
    const offset = (page - 1) * perPage;
    const items = await this.limit(perPage).offset(offset).all();
    return { items, total, page, perPage, totalPages: maxPage };
  }
}

export type RelationshipType =
  | "belongs_to"
  | "has_one"
  | "has_munknown"
  | "has_munknown_through"
  | "has_one_through"
  | "has_and_belongs_to_munknown";

export interface RelationshipMetadata {
  type: RelationshipType;
  model: string;
  foreignKey?: string;
  through?: string;
  source?: string;
  on?: string;
}

export type CallbackEvent =
  | "beforeValidation"
  | "afterValidation"
  | "beforeSave"
  | "afterSave"
  | "beforeCreate"
  | "afterCreate"
  | "beforeUpdate"
  | "afterUpdate"
  | "beforeDestroy"
  | "afterDestroy"
  | "afterCommit"
  | "afterCreateCommit"
  | "afterUpdateCommit"
  | "afterSaveCommit"
  | "afterDestroyCommit"
  | "afterRollback";

export interface CallbackOptions {
  on?: "create" | "update" | "destroy" | Array<"create" | "update" | "destroy">;
  if?: string | ((record: unknown) => boolean | Promise<boolean>);
  unless?: string | ((record: unknown) => boolean | Promise<boolean>);
}

interface CallbackEntry {
  fn: string | ((this: unknown, data: unknown) => void | Promise<void>);
  options?: CallbackOptions;
}

export const ABORT = Symbol("abort");

export class CallbackAbortError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CallbackAbortError";
  }
}

export interface ModelStaticConfig {
  filterableBy?: string[];
  searchableBy?: string[];
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/* ============================================================================
 * BaseModel
 * 
 * Connection: This layer → BasePersistence (RCSM - ONE call only)
 * ============================================================================ */

export abstract class BaseModel<
  TTable extends SQLiteTableWithColumns<any>,
  TSelect extends Record<string, any> = TTable["$inferSelect"],
  TInsert extends Record<string, any> = TTable["$inferInsert"],
  TStatic extends ModelStaticConfig = ModelStaticConfig,
  TModel extends Record<string, (this: unknown, ...args: unknown[]) => unknown> = Record<
    string,
    (this: unknown, ...args: unknown[]) => unknown
  >,
  Env = unknown,
  Ctx = ExecutionContext,
> {
  public relationships: Record<string, RelationshipMetadata> = {};

  public getRelations(): RelationshipMetadata[] {
    return Object.values(this.relationships);
  }

  private callbacks: Record<CallbackEvent, CallbackEntry[]> = {
    beforeValidation: [],
    afterValidation: [],
    beforeSave: [],
    afterSave: [],
    beforeCreate: [],
    afterCreate: [],
    beforeUpdate: [],
    afterUpdate: [],
    beforeDestroy: [],
    afterDestroy: [],
    afterCommit: [],
    afterCreateCommit: [],
    afterUpdateCommit: [],
    afterSaveCommit: [],
    afterDestroyCommit: [],
    afterRollback: [],
  };

  constructor(
    public db: DatabaseInstance,
    public table: TTable,
    public req: Request,
    public env: Env,
    public ctx: RouterContext<Env, Ctx>,
  ) {}

  public get columnNames(): string[] {
    return Object.keys(this.table);
  }

  protected belongsTo(name: string, options: { model: string; foreignKey?: string }) {
    this.relationships[name] = { type: "belongs_to", ...options };
  }

  protected hasOne(
    name: string,
    options: {
      model: string;
      foreignKey?: string;
      through?: string;
      source?: string;
    },
  ) {
    this.relationships[name] = { type: "has_one", ...options };
  }

  protected hasMunknown(
    name: string,
    options: {
      model: string;
      foreignKey?: string;
      through?: string;
      source?: string;
    },
  ) {
    this.relationships[name] = { type: "has_munknown", ...options };
  }

  protected hasAndBelongsToMunknown(
    name: string,
    options: { model: string; through: string; foreignKey?: string },
  ) {
    this.relationships[name] = { type: "has_and_belongs_to_munknown", ...options };
  }

  protected beforeValidation(
    fn: (this: unknown, data: unknown) => void | Promise<void>,
    options?: CallbackOptions,
  ) {
    this.registerCallback("beforeValidation", fn, options);
  }

  protected afterValidation(
    fn: (this: unknown, data: unknown) => void | Promise<void>,
    options?: CallbackOptions,
  ) {
    this.registerCallback("afterValidation", fn, options);
  }

  protected beforeSave(
    fn: (this: unknown, data: unknown) => void | Promise<void>,
    options?: CallbackOptions,
  ) {
    this.registerCallback("beforeSave", fn, options);
  }

  protected afterSave(
    fn: (this: unknown, data: unknown) => void | Promise<void>,
    options?: CallbackOptions,
  ) {
    this.registerCallback("afterSave", fn, options);
  }

  protected beforeCreate(
    fn: (this: unknown, data: unknown) => void | Promise<void>,
    options?: CallbackOptions,
  ) {
    this.registerCallback("beforeCreate", fn, options);
  }

  protected afterCreate(
    fn: (this: unknown, data: unknown) => void | Promise<void>,
    options?: CallbackOptions,
  ) {
    this.registerCallback("afterCreate", fn, options);
  }

  protected beforeUpdate(
    fn: (this: unknown, data: unknown) => void | Promise<void>,
    options?: CallbackOptions,
  ) {
    this.registerCallback("beforeUpdate", fn, options);
  }

  protected afterUpdate(
    fn: (this: unknown, data: unknown) => void | Promise<void>,
    options?: CallbackOptions,
  ) {
    this.registerCallback("afterUpdate", fn, options);
  }

  protected beforeDestroy(
    fn: (this: unknown, data: unknown) => void | Promise<void>,
    options?: CallbackOptions,
  ) {
    this.registerCallback("beforeDestroy", fn, options);
  }

  protected afterDestroy(
    fn: (this: unknown, data: unknown) => void | Promise<void>,
    options?: CallbackOptions,
  ) {
    this.registerCallback("afterDestroy", fn, options);
  }

  protected afterCreateCommit(fn: (this: unknown, data: unknown) => void | Promise<void>) {
    this.registerCallback("afterCreateCommit", fn);
  }

  protected afterUpdateCommit(fn: (this: unknown, data: unknown) => void | Promise<void>) {
    this.registerCallback("afterUpdateCommit", fn);
  }

  protected afterSaveCommit(fn: (this: unknown, data: unknown) => void | Promise<void>) {
    this.registerCallback("afterSaveCommit", fn);
  }

  protected afterDestroyCommit(fn: (this: unknown, data: unknown) => void | Promise<void>) {
    this.registerCallback("afterDestroyCommit", fn);
  }

  protected afterCommit(fn: (this: unknown, data: unknown) => void | Promise<void>) {
    this.registerCallback("afterCommit", fn);
  }

  protected afterRollback(fn: (this: unknown, data: unknown) => void | Promise<void>) {
    this.registerCallback("afterRollback", fn);
  }

  private registerCallback(
    event: CallbackEvent,
    fn: (this: unknown, data: unknown) => void | Promise<void>,
    options?: CallbackOptions,
  ) {
    this.callbacks[event].push({
      fn: fn.bind(this),
      options,
    });
  }

  private async runCallbacks(
    event: CallbackEvent,
    context: "create" | "update" | "destroy",
    data: unknown,
  ): Promise<void> {
    for (const { fn, options } of this.callbacks[event]) {
      if (options?.on) {
        const contexts = Array.isArray(options.on) ? options.on : [options.on];
        if (!contexts.includes(context)) continue;
      }

      if (options?.if) {
        const condition =
          typeof options.if === "string"
            ? (this as unknown as TModel)[options.if]?.bind(this)
            : options.if;
        if (condition && !(await condition.call(this, data))) continue;
      }

      if (options?.unless) {
        const condition =
          typeof options.unless === "string"
            ? (this as unknown as TModel)[options.unless]?.bind(this)
            : options.unless;
        if (condition && (await condition.call(this, data))) continue;
      }

      try {
        const callback = typeof fn === "string" ? (this as unknown as TModel)[fn] : fn;
        const result = await callback.call(data, data);

        if (result === ABORT) {
          throw new CallbackAbortError(`Callback aborted: ${event}`);
        }
      } catch (err) {
        if (err instanceof CallbackAbortError) {
          throw err;
        }
        const error = err as Error;
        this.logger?.error(`[CALLBACK ERROR] ${event}`, { error: error.message });
        throw err;
      }
    }
  }

  protected get logger(): Logger {
    return (
      this.ctx?.logger ||
      new Logger({
        service: "models",
        context: {
          table: getTableName(this.table),
        },
      })
    );
  }

  query(): FluentQuery<TTable, TSelect> {
    return new FluentQuery<TTable, TSelect>(this.db, this.table, this.logger).setRelationships(
      this.relationships,
    );
  }

  where(conditions: Record<string, unknown>): FluentQuery<TTable, TSelect> {
    return this.query().where(conditions);
  }

  select(...columns: (keyof TSelect | "*")[]): FluentQuery<TTable, TSelect> {
    return this.query().select(...columns);
  }

  with(...relations: string[]): FluentQuery<TTable, TSelect> {
    return this.query().with(...relations);
  }

  withJoins(...relations: string[]): FluentQuery<TTable, TSelect> {
    return this.query().withJoins(...relations);
  }

  withSeparateQueries(...relations: string[]): FluentQuery<TTable, TSelect> {
    return this.query().withSeparateQueries(...relations);
  }

  selectColumnValues(
    columns: keyof TSelect | keyof TSelect[],
    conditions?: Record<string, unknown>,
    options?: {
      orderBy?: { column: keyof TSelect; direction?: "ASC" | "DESC" };
      limit?: number;
      offset?: number;
    },
  ): Promise<unknown[]> {
    return this.pluck(columns, conditions, options);
  }

  orderBy(column: keyof TSelect, direction: "ASC" | "DESC" = "ASC"): FluentQuery<TTable, TSelect> {
    return this.query().orderBy(column, direction);
  }

  limit(n: number): FluentQuery<TTable, TSelect> {
    return this.query().limit(n);
  }

  offset(n: number): FluentQuery<TTable, TSelect> {
    return this.query().offset(n);
  }

  async findBy(
    conditions: Record<string, unknown>,
    options?: {
      offset?: number;
    },
  ): Promise<TSelect | null> {
    return this.query().findBy(conditions, options);
  }

  async findAllBy(
    conditions: Record<string, unknown>,
    options?: {
      orderBy?: { column: keyof TSelect; direction?: "ASC" | "DESC" };
      limit?: number;
      offset?: number;
    },
  ): Promise<TSelect[]> {
    return this.query().findAllBy(conditions, options);
  }

  async count(): Promise<number> {
    return this.query().count();
  }

  async countBy(conditions: Record<string, unknown>): Promise<number> {
    return this.query().where(conditions).count();
  }

  async findByIds(ids: (string | number)[]): Promise<TSelect[]> {
    if (ids.length === 0) return [];
    return this.query()
      .where({ id: { in: ids } })
      .all();
  }

  async firstBy(
    conditions: Record<string, unknown>,
    options?: {
      offset?: number;
    },
  ): Promise<TSelect | null> {
    return this.findBy(conditions, options);
  }

  async pluck(
    columns: keyof TSelect | keyof TSelect[],
    conditions?: Record<string, unknown>,
    options?: {
      orderBy?: { column: keyof TSelect; direction?: "ASC" | "DESC" };
      limit?: number;
      offset?: number;
    },
  ): Promise<unknown[]> {
    const cols = Array.isArray(columns) ? columns : [columns];

    let query = this.query().where(conditions || {});

    if (options?.orderBy?.column) {
      query = query.orderBy(options.orderBy.column, options.orderBy.direction || "ASC");
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.offset(options.offset);
    }

    if (cols.length === 1) {
      const col = cols[0] as keyof TSelect;
      return query.pluck(col) as Promise<unknown[]>;
    }

    return query.select(...(cols as (keyof TSelect)[])).all() as Promise<unknown[]>;
  }

  async paginate(
    params: { page?: number; perPage?: number; filters?: Record<string, unknown> } = {},
  ) {
    let query = this.query();
    const { filters, ...paginationParams } = params;
    if (filters) {
      const staticConfig = this.constructor as new (...args: unknown[]) => TStatic;
      const allowed = (staticConfig.prototype?.filterableBy as string[]) || [];
      for (const [key, value] of Object.entries(filters)) {
        if (!allowed.includes(key)) continue;
        if (value === undefined || value === null || value === "") continue;
        query = query.where({ [key]: value });
      }
    }
    return query.paginate(paginationParams);
  }

  async search(term: string, columns?: string[]) {
    if (!term) return this.query();
    const staticConfig = this.constructor as new (...args: unknown[]) => TStatic;
    const cols = columns || (staticConfig.prototype?.searchableBy as string[]) || [];
    if (cols.length === 0) return this.query();
    return this.query().where({
      $or: cols.map((col: string) => ({ [col]: { like: `%${term}%` } })),
    });
  }

  // ===== Lifecycle Query Helpers =====

  trashed(): FluentQuery<TTable, TSelect> {
    return this.query().where({ trashed_at: { neq: null } });
  }

  notTrashed(): FluentQuery<TTable, TSelect> {
    return this.query().where({ trashed_at: null });
  }

  hidden(): FluentQuery<TTable, TSelect> {
    return this.query().where({ hidden_at: { neq: null } });
  }

  notHidden(): FluentQuery<TTable, TSelect> {
    return this.query().where({ hidden_at: null });
  }

  flagged(): FluentQuery<TTable, TSelect> {
    return this.query().where({ flagged_at: { neq: null } });
  }

  notFlagged(): FluentQuery<TTable, TSelect> {
    return this.query().where({ flagged_at: null });
  }

  retired(): FluentQuery<TTable, TSelect> {
    return this.query().where({ retired_at: { neq: null } });
  }

  notRetired(): FluentQuery<TTable, TSelect> {
    return this.query().where({ retired_at: null });
  }

  active(): FluentQuery<TTable, TSelect> {
    return this.query().where({
      trashed_at: null,
      hidden_at: null,
      retired_at: null,
    });
  }

  // ===== Lifecycle Mutations =====

  async trash(id: number | string): Promise<TSelect> {
    return this.update(id, { trashed_at: new Date().toISOString() } as Record<string, any>);
  }

  async restore(id: number | string): Promise<TSelect> {
    return this.update(id, { trashed_at: null } as Record<string, any>);
  }

  async hide(id: number | string): Promise<TSelect> {
    return this.update(id, { hidden_at: new Date().toISOString() } as Record<string, any>);
  }

  async unhide(id: number | string): Promise<TSelect> {
    return this.update(id, { hidden_at: null } as Record<string, any>);
  }

  async flag(id: number | string): Promise<TSelect> {
    return this.update(id, { flagged_at: new Date().toISOString() } as Record<string, any>);
  }

  async unflag(id: number | string): Promise<TSelect> {
    return this.update(id, { flagged_at: null } as Record<string, any>);
  }

  async retire(id: number | string): Promise<TSelect> {
    return this.update(id, { retired_at: new Date().toISOString() } as Record<string, any>);
  }

  async unretire(id: number | string): Promise<TSelect> {
    return this.update(id, { retired_at: null } as Record<string, any>);
  }

  async purge(id: number | string): Promise<boolean> {
    return this.delete(id);
  }

  // ===== Async Operations =====

  async queue(
    id: number | string,
    data?: Record<string, unknown>,
  ): Promise<{ queued: boolean; id: string | number; data?: Record<string, unknown> }> {
    this.logger?.info(`[QUEUE] ${getTableName(this.table)}#${id}`);
    return {
      queued: true,
      id,
      data,
    };
  }

  async cron(
    id: number | string,
    data?: Record<string, unknown>,
  ): Promise<{ scheduled: boolean; id: string | number; data?: Record<string, unknown> }> {
    this.logger?.info(`[CRON] ${getTableName(this.table)}#${id}`);
    return {
      scheduled: true,
      id,
      data,
    };
  }

  async add(id: number | string, relation: string): Promise<TSelect> {
    this.logger?.info(`[ADD] ${getTableName(this.table)}#${id} to ${relation}`);
    return this.findBy({ id } as Record<string, unknown>) as Promise<TSelect>;
  }

  async remove(
    id: number | string,
    relation: string,
    relatedId: number | string,
  ): Promise<TSelect> {
    this.logger?.info(`[REMOVE] ${relatedId} from ${getTableName(this.table)}#${id}`);
    return this.findBy({ id } as Record<string, unknown>) as Promise<TSelect>;
  }

  async assign(
    id: number | string,
    relation: string,
    relatedId: number | string,
  ): Promise<TSelect> {
    this.logger?.info(`[ASSIGN] ${relation}#${relatedId} to ${getTableName(this.table)}#${id}`);
    return this.findBy({ id } as Record<string, unknown>) as Promise<TSelect>;
  }

  async unassign(
    id: number | string,
    relation: string,
    relatedId: number | string,
  ): Promise<TSelect> {
    this.logger?.info(`[UNASSIGN] ${relation}#${relatedId} from ${getTableName(this.table)}#${id}`);
    return this.findBy({ id } as Record<string, unknown>) as Promise<TSelect>;
  }

  // ===== Relationship Traversal =====

  async listChildIds(relationName: string, id: number | string): Promise<(string | number)[]> {
    const rel = this.relationships[relationName];
    if (!rel || rel.type !== "has_munknown" || !rel.foreignKey) return [];

    const db = this.db as DatabaseInstance &
      Record<string, { where: (conds: unknown) => { pluck: (col: string) => Promise<unknown[]> } }>;
    const relatedModel = db[rel.model];
    if (!relatedModel?.where) return [];

    const result = await relatedModel.where({ [rel.foreignKey]: id }).pluck("id");
    return result as (string | number)[];
  }

  async listParentIds(relationName: string, id: number | string): Promise<(string | number)[]> {
    const rel = this.relationships[relationName];
    if (!rel || rel.type !== "belongs_to" || !rel.foreignKey) return [];

    const item = await this.findBy({ id } as Record<string, unknown>);
    if (!item) return [];

    const parentId = item[rel.foreignKey as keyof TSelect];
    return parentId ? [parentId] : [];
  }

  async listSiblingIds(relationName: string, id: number | string): Promise<(string | number)[]> {
    const rel = this.relationships[relationName];
    if (!rel || rel.type !== "has_munknown" || !rel.foreignKey) return [];

    const item = await this.findBy({ id } as Record<string, unknown>);
    if (!item) return [];

    const parentId = item[rel.foreignKey as keyof TSelect];
    if (!parentId) return [];

    const foreignKey = rel.foreignKey;
    const db = this.db as DatabaseInstance &
      Record<string, { where: (conds: unknown) => { pluck: (col: string) => Promise<unknown[]> } }>;
    const relatedModel = db[rel.model];
    if (!relatedModel?.where) return [];

    const result = await relatedModel
      .where({ [foreignKey]: parentId, id: { neq: id } })
      .pluck("id");
    return result as (string | number)[];
  }

  async listCousinIds(relationName: string, id: number | string): Promise<(string | number)[]> {
    const rel = this.relationships[relationName];
    if (!rel || rel.type !== "has_munknown" || !rel.foreignKey) return [];

    const item = await this.findBy({ id } as Record<string, unknown>);
    if (!item) return [];

    const parentId = item[rel.foreignKey as keyof TSelect];
    if (!parentId) return [];

    const parentRel = Object.values(this.relationships).find(
      (r) => r.type === "belongs_to" && r.foreignKey,
    ) as RelationshipMetadata | undefined;
    if (!parentRel || !parentRel.foreignKey) return [];

    const parent = await this.findBy({ id: parentId } as Record<string, unknown>);
    if (!parent) return [];

    const grandparentId = parent[parentRel.foreignKey as keyof TSelect];
    if (!grandparentId) return [];

    const cousins: (string | number)[] = [];
    const db = this.db as DatabaseInstance &
      Record<string, { where: (conds: unknown) => { pluck: (col: string) => Promise<unknown[]> } }>;

    for (const [siblingRelName, siblingRel] of Object.entries(this.relationships)) {
      if (
        typeof siblingRelName === "string" &&
        siblingRel.type === "has_munknown" &&
        siblingRelName !== relationName &&
        siblingRel.foreignKey
      ) {
        const siblingModel = db[siblingRel.model];
        if (!siblingModel?.where) continue;

        const siblings = await siblingModel
          .where({ [siblingRel.foreignKey]: grandparentId, id: { neq: id } })
          .pluck("id");
        cousins.push(...(siblings as (string | number)[]));
      }
    }

    return cousins;
  }

  async listAncestorIds(relationName: string, id: number | string): Promise<(string | number)[]> {
    const rel = this.relationships[relationName];
    if (!rel || rel.type !== "belongs_to" || !rel.foreignKey) return [];

    const ancestors: (string | number)[] = [];
    let currentId: string | number | null = id;

    while (currentId) {
      const item = await this.findBy({ id: currentId } as Record<string, unknown>);
      if (!item) break;

      currentId = item[rel.foreignKey as keyof TSelect] as string | number | null;
      if (currentId) {
        ancestors.push(currentId);
      }
    }

    return ancestors;
  }

  async listDescendantIds(relationName: string, id: number | string): Promise<(string | number)[]> {
    const rel = this.relationships[relationName];
    if (!rel || rel.type !== "has_munknown" || !rel.foreignKey) return [];

    const descendants: (string | number)[] = [];
    const foreignKey = rel.foreignKey;
    const db = this.db as DatabaseInstance &
      Record<string, { where: (conds: unknown) => { pluck: (col: string) => Promise<unknown[]> } }>;
    const relatedModel = db[rel.model];
    if (!relatedModel?.where) return [];

    const collectDescendants = async (parentId: string | number) => {
      const children = (await relatedModel.where({ [foreignKey]: parentId }).pluck("id")) as (
        | string
        | number
      )[];

      for (const childId of children) {
        descendants.push(childId);
        await collectDescendants(childId);
      }
    };

    await collectDescendants(id);
    return descendants;
  }

  async listAssociatedThroughIds(
    _relationName: string,
    _throughTable: string,
    _id: number | string,
  ): Promise<(string | number)[]> {
    throw new Error(
      "listAssociatedThroughIds requires Drizzle - not supported in current configuration",
    );
  }

  async listRelatedIds(relationName: string, id: number | string): Promise<(string | number)[]> {
    const rel = this.relationships[relationName];
    if (!rel) return [];

    if (rel.type === "has_munknown") {
      return this.listChildIds(relationName, id);
    }

    if (rel.type === "has_one") {
      if (!rel.foreignKey) return [];
      const item = await this.findBy({ id } as Record<string, unknown>);
      if (!item) return [];
      const childId = item[rel.foreignKey as keyof TSelect];
      return childId ? [childId] : [];
    }

    if (rel.type === "belongs_to") {
      if (!rel.foreignKey) return [];
      return this.listParentIds(relationName, id);
    }

    return [];
  }

  // ===== Include/Eager Loading Methods =====

  async findAllWith(
    conditions: Record<string, unknown>,
    includes: Record<string, { model: string; foreignKey: string }>,
    options?: {
      orderBy?: { column: string; direction?: "ASC" | "DESC" };
      limit?: number;
      offset?: number;
    },
  ): Promise<TSelect[]> {
    const items = await this.findAllBy(
      conditions,
      options as {
        orderBy?: { column: keyof TSelect; direction?: "ASC" | "DESC" };
        limit?: number;
        offset?: number;
      },
    );
    if (!items?.length || !includes || Object.keys(includes).length === 0) {
      return items;
    }

    const db = this.db as DatabaseInstance & ModelAccess;
    const includeEntries = Object.entries(includes);
    const results = await Promise.all(
      items.map(async (item) => {
        const enriched = { ...item };
        for (const [includeKey, includeConfig] of includeEntries) {
          const rel = this.relationships[includeKey];
          const foreignKeyValue = item[includeConfig.foreignKey as keyof TSelect];

          if (rel?.type === "has_munknown") {
            const relatedModel = db[includeConfig.model];
            if (!relatedModel) continue;
            const query = relatedModel.where?.({ [includeConfig.foreignKey]: item.id });
            const relatedItems = query ? await query.all() : [];
            (enriched as Record<string, unknown>)[includeKey] = relatedItems;
          } else if (foreignKeyValue) {
            const relatedModel = db[includeConfig.model];
            if (!relatedModel) continue;
            const query = relatedModel.where?.({ id: foreignKeyValue });
            const relatedItems = query ? await query.all() : [];
            (enriched as Record<string, unknown>)[includeKey] = relatedItems;
          } else {
            (enriched as Record<string, unknown>)[includeKey] = [];
          }
        }
        return enriched as TSelect;
      }),
    );

    return results;
  }

  async findWith(
    conditions: Record<string, unknown>,
    includes: Record<string, { model: string; foreignKey: string }>,
  ): Promise<TSelect | null> {
    const item = await this.findBy(conditions);
    if (!item || !includes || Object.keys(includes).length === 0) {
      return item;
    }

    const db = this.db as DatabaseInstance & ModelAccess;
    const enriched = { ...item };

    for (const [includeKey, includeConfig] of Object.entries(includes)) {
      const foreignKeyValue = item[includeConfig.foreignKey as keyof TSelect];
      if (foreignKeyValue) {
        const relatedModel = db[includeConfig.model];
        if (!relatedModel) continue;
        const query = relatedModel.where?.({ id: foreignKeyValue });
        const relatedItems = query ? await query.all() : [];
        (enriched as Record<string, unknown>)[includeKey] = relatedItems;
      } else {
        (enriched as Record<string, unknown>)[includeKey] = [];
      }
    }

    return enriched as TSelect;
  }

  // --- Lifecycle Hooks ---
  protected async _beforeValidation(
    data: TInsert | Partial<TInsert>,
  ): Promise<TInsert | Partial<TInsert>> {
    const hasId = "id" in data && data.id != null;
    await this.runCallbacks("beforeValidation", hasId ? "update" : "create", data);
    return data;
  }

  protected async _afterValidation(data: TInsert | Partial<TInsert>): Promise<void> {
    const hasId = "id" in data && data.id != null;
    await this.runCallbacks("afterValidation", hasId ? "update" : "create", data);
  }

  protected async _beforeCreate(data: TInsert): Promise<TInsert> {
    const tableName = getTableName(this.table);
    this.logger?.debug(`[BEFORE CREATE] ${tableName}`, { data });
    await this.runCallbacks("beforeCreate", "create", data);

    const tableConfig = this.table as unknown as { id?: { autoIncrement?: boolean } };
    const idColumn = tableConfig?.id;
    const hasAutoIncrement = idColumn?.autoIncrement;

    if (!data.id && !hasAutoIncrement) {
      (data as TInsert & { id: string }).id = crypto.randomUUID();
    }
    return data;
  }

  protected async _afterCreate(record: TSelect): Promise<void> {
    const tableName = getTableName(this.table);
    const recordWithId = record as TSelect & { id: string | number };
    this.logger?.debug(`[AFTER CREATE] ${tableName}#${recordWithId.id}`, {
      record,
    });
    await this.runCallbacks("afterCreate", "create", record);
  }

  protected async _beforeUpdate(data: Partial<TInsert>): Promise<Partial<TInsert>> {
    const tableName = getTableName(this.table);
    this.logger?.debug(`[BEFORE UPDATE] ${tableName}`, { data });
    await this.runCallbacks("beforeUpdate", "update", data);
    return data;
  }

  protected async _afterUpdate(record: TSelect): Promise<void> {
    const tableName = getTableName(this.table);
    const recordWithId = record as TSelect & { id: string | number };
    this.logger?.debug(`[AFTER UPDATE] ${tableName}#${recordWithId.id}`, {
      record,
    });
    await this.runCallbacks("afterUpdate", "update", record);
  }

  protected async _beforeSave(
    data: TInsert | Partial<TInsert> | DeepPartial<TInsert>,
  ): Promise<TInsert | Partial<TInsert> | DeepPartial<TInsert>> {
    const tableName = getTableName(this.table);
    this.logger?.debug(`[BEFORE SAVE] ${tableName}`, { data });
    const context = "id" in data && data.id != null ? "update" : "create";
    await this.runCallbacks("beforeSave", context, data);
    return data;
  }

  protected async _afterSave(record: TSelect): Promise<void> {
    const tableName = getTableName(this.table);
    const recordWithId = record as TSelect & { id: string | number };
    this.logger?.debug(`[AFTER SAVE] ${tableName}#${recordWithId.id}`, {
      record,
    });
    const context = "id" in record && record.id != null ? "update" : "create";
    await this.runCallbacks("afterSave", context, record);
  }

  protected async _beforeDelete(id: number | string): Promise<void> {
    const tableName = getTableName(this.table);
    this.logger?.debug(`[BEFORE DELETE] ${tableName}#${id}`);
    await this.runCallbacks("beforeDestroy", "destroy", { id });
  }

  protected async _afterDelete(id: number | string): Promise<void> {
    const tableName = getTableName(this.table);
    this.logger?.debug(`[AFTER DELETE] ${tableName}#${id}`);
    await this.runCallbacks("afterDestroy", "destroy", { id });
  }

  async create(data: TInsert): Promise<TSelect> {
    const tableName = getTableName(this.table);
    this.logger?.info(`[CREATE] ${tableName}`, { data });

    let finalData = (await this._beforeSave(data)) as TInsert;
    finalData = await this._beforeCreate(finalData);

    let record: TSelect;

    const filtered: Partial<TInsert> = {};
    for (const k in finalData) {
      if (k in this.table && finalData[k] !== undefined && finalData[k] !== null) {
        filtered[k as keyof TInsert] = finalData[k];
      }
    }

    const keys = Object.keys(filtered) as string[];
    const vals = keys.map((k) => filtered[k as keyof TInsert]);

    const s = sql.statement([
      sql.key("INSERT INTO "),
      sql.id(tableName),
      sql.op(" ("),
      sql.join(
        keys.map((k) => sql.id(k)),
        sql.op(", "),
      ),
      sql.op(") VALUES ("),
      sql.join(
        vals.map((v) => sql.val(v)),
        sql.op(", "),
      ),
      sql.op(") RETURNING *"),
    ]);
    const res = await this.queryExec(s);
    record = res[0] as TSelect;

    await this._afterCreate(record);
    await this._afterSave(record);
    await this.runCallbacks("afterCommit", "create", record);
    await this.runCallbacks("afterCreateCommit", "create", record);
    await this.runCallbacks("afterSaveCommit", "create", record);
    const recordWithId = record as TSelect & { id: string | number };
    this.logger?.info(`[CREATED] ${tableName}#${recordWithId.id}`);
    return record;
  }

  async update(id: number | string, data: DeepPartial<TInsert>): Promise<TSelect> {
    const tableName = getTableName(this.table);
    this.logger?.info(`[UPDATE] ${tableName}#${id}`, { data });

    const processedData = await this._beforeSave(data as Partial<TInsert>);
    const finalData = await this._beforeUpdate(processedData as Partial<TInsert>);

    let record: TSelect;

    const filtered: Partial<TInsert> = {};
    for (const k in finalData) {
      if (k in this.table && finalData[k] !== undefined && finalData[k] !== null) {
        filtered[k as keyof TInsert] = finalData[k];
      }
    }

    if (Object.keys(filtered).length === 0) {
      this.logger?.warn(`[UPDATE SKIP] ${tableName}#${id}: No valid columns to update`);
      const existing = await this.find(id);
      if (!existing) throw new Error(`Record with id ${id} not found`);
      return existing;
    }

    const entries = Object.entries(filtered).map(([k, v]) =>
      sql.composite(sql.id(k), sql.op(" = "), sql.val(v)),
    );

    const s = sql.statement([
      sql.key("UPDATE "),
      sql.id(tableName),
      sql.key(" SET "),
      sql.join(entries, sql.op(", ")),
      sql.nl(),
      sql.key("WHERE "),
      sql.id("id"),
      sql.op(" = "),
      sql.val(id),
      sql.key(" RETURNING *"),
    ]);
    const res = await this.queryExec(s);
    if (res.length === 0) throw new Error(`Record with id ${id} not found`);
    record = res[0] as TSelect;

    await this._afterUpdate(record);
    await this._afterSave(record);
    await this.runCallbacks("afterCommit", "update", record);
    await this.runCallbacks("afterUpdateCommit", "update", record);
    await this.runCallbacks("afterSaveCommit", "update", record);
    this.logger?.info(`[UPDATED] ${tableName}#${id}`);
    return record;
  }

  async delete(id: number | string): Promise<boolean> {
    const tableName = getTableName(this.table);
    this.logger?.info(`[DELETE] ${tableName}#${id}`);

    await this._beforeDelete(id);

    const s = sql.statement([
      sql.key("DELETE FROM "),
      sql.id(tableName),
      sql.key(" WHERE "),
      sql.id("id"),
      sql.op(" = "),
      sql.val(id),
      sql.key(" RETURNING *"),
    ]);
    const res = await this.queryExec(s);
    const success = res.length > 0;

    if (success) {
      await this._afterDelete(id);
      await this.runCallbacks("afterCommit", "destroy", { id });
      await this.runCallbacks("afterDestroyCommit", "destroy", { id });
      this.logger?.info(`[DELETED] ${tableName}#${id}`);
    }
    return success;
  }

  async find(id: number | string): Promise<TSelect | null> {
    const tableName = getTableName(this.table);
    this.logger?.debug(`[FIND] ${tableName}#${id}`);

    const record = await this.where({ id }).first();

    if (record) {
      this.logger?.debug(`[FOUND] ${tableName}#${id}`);
    } else {
      this.logger?.debug(`[NOT FOUND] ${tableName}#${id}`);
    }

    return record;
  }

  async all(): Promise<TSelect[]> {
    const tableName = getTableName(this.table);
    this.logger?.debug(`[ALL] ${tableName}`);

    const records = await this.query().all();

    this.logger?.debug(`[ALL RESULT] ${tableName} count=${records.length}`);
    return records;
  }

  private async queryExec(s: Statement): Promise<unknown[]> {
    const strategy = getDialectStrategy("sqlite");
    const sqlRes = s.toSql(strategy);
    if (!sqlRes.success) throw new Error(sqlRes.message);
    const sqlText = sqlRes.data.value;

    this.logger?.debug(`[SQL] ${sqlText}`);
    const db = this.db;

    try {
      if ("execSql" in db) return await (db as RpcDb).execSql(sqlText);
      if ("prepare" in db) {
        const res = await (db as D1Database & D1Db).prepare(sqlText).all();
        return (res.results || res) as unknown[];
      }
      if ("exec" in db) return (db as DurableObjectStorage & DoStorage).exec(sqlText).toArray();
    } catch (err) {
      const error = err as Error;
      this.logger?.error(`[SQL ERROR]`, { sql: sqlText, error: error.message });

      const errorMsg = error.message || "";

      if (errorMsg.includes("UNIQUE constraint failed")) {
        throw new ConflictError(`Unique constraint violated: ${errorMsg}`);
      }
      if (errorMsg.includes("FOREIGN KEY constraint failed")) {
        throw new ConstraintError("Foreign key constraint violated", "FOREIGN_KEY", {
          originalError: errorMsg,
        });
      }
      if (errorMsg.includes("NOT NULL constraint failed")) {
        throw new ConstraintError("Not null constraint violated", "NOT_NULL", {
          originalError: errorMsg,
        });
      }
      if (errorMsg.includes("CHECK constraint failed")) {
        throw new ConstraintError("Check constraint violated", "CHECK", {
          originalError: errorMsg,
        });
      }
      if (errorMsg.includes("datatype mismatch")) {
        throw new BadRequestError(`Datatype mismatch: ${errorMsg}`);
      }
      throw err;
    }
    throw new Error("No execution driver available for statement");
  }

  async transaction<T>(fn: (model: this) => Promise<T>): Promise<T> {
    const tableName = getTableName(this.table);
    this.logger?.info(`[TRANSACTION START] ${tableName}`);

    try {
      const result = await fn(this);
      await this.runCallbacks("afterCommit", "create", result);
      await this.runCallbacks("afterCreateCommit", "create", result);
      await this.runCallbacks("afterUpdateCommit", "update", result);
      await this.runCallbacks("afterSaveCommit", "create", result);
      this.logger?.info(`[TRANSACTION COMMIT] ${tableName}`);
      return result;
    } catch (err) {
      const error = err as Error;
      await this.runCallbacks("afterRollback", "create", { error: error.message });
      this.logger?.error(`[TRANSACTION ROLLBACK] ${tableName}`, { error: error.message });
      throw err;
    }
  }
}

export function defineModel<TTableName extends string, TColumnsMap extends Record<string, any>>(
  name: TTableName,
  columns: TColumnsMap,
) {
  return sqliteTable(name, columns);
}
