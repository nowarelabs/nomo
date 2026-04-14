/**
 * noware-features - BaseFeatureHandler
 * 
 * Standard Gauge: Feature Orchestration Layer (can call multiple RCSM chains)
 * 
 * Connection Flow:
 * BaseFeatureHandler → BaseController[] (multiple RCSM chains allowed)
 * 
 * Static Plugin Points:
 * - controllers: Map<string, BaseController>
 */

export abstract class BaseFeatureHandler<Env = unknown, Ctx = unknown> {
  constructor(protected env: Env, protected ctx: Ctx) {}
  
  async handle(input: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }
}