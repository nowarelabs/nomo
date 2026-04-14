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

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class JobDispatcher<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike
> {
  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  async dispatch(jobName: string, payload: unknown): Promise<void> {
    throw new Error("Not implemented");
  }
}