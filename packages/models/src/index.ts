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

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class BaseModel<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext,
  Persistence = unknown
> {
  protected abstract persistence: Persistence;
  
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  protected abstract getPersistence(): Persistence;
}
