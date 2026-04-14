/**
 * noware-persistence - BasePersistence
 *
 * Standard Gauge: Persistence layer (P in RCSM)
 *
 * Connection Flow:
 * BaseModel → BasePersistence → Database
 *
 * Connection: This layer → Database (Tier 1 - external)
 *
 * Static Plugin Points:
 * - migrations: Migration[]
 * - dialects: Record<string, Dialect>
 */

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class BasePersistence<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike,
> {
  static migrations: unknown[] = [];
  static dialects: Record<string, unknown> = {};

  protected db: unknown;

  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}

  protected abstract connect(): Promise<void>;
}
