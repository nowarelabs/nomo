/**
 * noware-models - BaseModel
 *
 * Standard Gauge: Model layer (M in RCSM)
 *
 * Connection Flow:
 * BaseService → BaseModel → BasePersistence
 *
 * Connection: This layer → BasePersistence (RCSM - ONE call only)
 *
 * Static Plugin Points:
 * - columnTypes: Record<string, string>
 * - relations: Record<string, RelationConfig>
 */

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class BaseModel<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike,
  Persistence = unknown,
> {
  static columnTypes: Record<string, string> = {};
  static relations: Record<string, unknown> = {};

  protected abstract persistence: Persistence;

  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}

  protected abstract getPersistence(): Persistence;
}
