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

export abstract class JobDispatcher {
  async dispatch(jobName: string, payload: unknown): Promise<void> {
    throw new Error("Not implemented");
  }
}