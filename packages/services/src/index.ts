/**
 * noware-services - BaseService
 * 
 * Standard Gauge: Service layer (S in RCSM)
 * 
 * Connection Flow:
 * BaseController → BaseService → BaseModel
 * 
 * Connection: This layer → BaseModel (RCSM - ONE call only)
 * 
 * Static Plugin Points:
 * - hooks: Record<string, Function>
 */

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class BaseService<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike,
  Model = unknown
> {
  protected abstract model: Model;
  
  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  protected abstract getModel(): Model;
}
