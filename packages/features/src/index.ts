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

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class BaseFeatureHandler<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike
> {
  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  async handle(input: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }
}
