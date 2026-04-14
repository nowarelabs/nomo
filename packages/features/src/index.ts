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

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class BaseFeatureHandler<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext
> {
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  async handle(input: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }
}
