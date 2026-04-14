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

export abstract class BaseRouter<Env = unknown, Ctx = unknown> {
  constructor(protected env: Env, protected ctx: Ctx) {}
  
  async handle(request: Request): Promise<Response> {
    throw new Error("Not implemented");
  }
}