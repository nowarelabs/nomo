/**
 * noware-rpc - BaseRpcServer
 * 
 * Standard Gauge: RPC Server (Tier 2)
 * 
 * Connection Flow:
 * BaseRpcServer → BaseFeatureHandler → BaseController
 * 
 * Connection: This layer → BaseFeatureHandler (ONE call only)
 * 
 * Static Plugin Points:
 * - handlers: Map<string, BaseFeatureHandler>
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class BaseRpcServer<
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