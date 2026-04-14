/**
 * noware-router - BaseRouter
 * 
 * Standard Gauge: Router (Tier 2)
 * 
 * Connection Flow:
 * BaseRouter → BaseRpcServer → BaseFeatureHandler
 * 
 * Connection: This layer → BaseRpcServer (ONE call only)
 * 
 * Static Plugin Points:
 * - routes: RouteConfig[]
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class BaseRouter<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext
> {
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  async handle(request: Request): Promise<Response> {
    throw new Error("Not implemented");
  }
}