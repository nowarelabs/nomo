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

export abstract class BaseService<
  Env = unknown,
  Ctx = unknown,
  Model = unknown
> {
  protected abstract model: Model;
  
  constructor(protected env: Env, protected ctx: Ctx) {}
  
  protected abstract getModel(): Model;
}