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

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class BaseController<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext,
  Service = unknown
> {
  protected abstract service: Service;
  
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  protected abstract getService(): Service;
  
  async runAction(name: string): Promise<Response> {
    throw new Error("Not implemented");
  }
}