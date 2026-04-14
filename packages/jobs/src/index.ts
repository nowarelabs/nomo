/**
 * noware-jobs - JobDispatcher
 * 
 * Standard Gauge: Background Jobs (Tier 2)
 * 
 * Connection: Dispatches jobs to BaseJob handlers
 * 
 * Static Plugin Points:
 * - jobs: Map<string, JobHandler>
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class JobDispatcher<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext
> {
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  async dispatch(jobName: string, payload: unknown): Promise<void> {
    throw new Error("Not implemented");
  }
}