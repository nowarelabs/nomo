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

export abstract class BasePersistence<Env = unknown, Ctx = unknown> {
  protected db: unknown;
  
  constructor(protected env: Env, protected ctx: Ctx) {}
  
  protected abstract connect(): Promise<void>;
}