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

export abstract class BaseModel<
  Env = unknown,
  Ctx = unknown,
  Persistence = unknown
> {
  protected abstract persistence: Persistence;
  
  constructor(protected env: Env, protected ctx: Ctx) {}
  
  protected abstract getPersistence(): Persistence;
}