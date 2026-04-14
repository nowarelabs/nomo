/**
 * noware-controllers - BaseController
 * 
 * Standard Gauge: Controller layer (C in RCSM)
 * 
 * Connection Flow:
 * BaseRpc → BaseController → BaseService
 * 
 * Connection: This layer → BaseService (RCSM - ONE call only)
 * 
 * Static Plugin Points:
 * - beforeActions: HookConfig[]
 * - afterActions: HookConfig[]
 */

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class BaseController<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike,
  Service = unknown
> {
  protected abstract service: Service;
  
  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  protected abstract getService(): Service;
  
  async runAction(name: string): Promise<Response> {
    throw new Error("Not implemented");
  }
}