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

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class BasePersistence<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext
> {
  protected db: unknown;
  
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  protected abstract connect(): Promise<void>;
}
