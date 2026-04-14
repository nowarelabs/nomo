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

export abstract class BaseRpcServer<Env = unknown, Ctx = unknown> {
  constructor(protected env: Env, protected ctx: Ctx) {}
  
  async handle(request: Request): Promise<Response> {
    throw new Error("Not implemented");
  }
}