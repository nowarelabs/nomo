/**
 * noware-ports - Port Interfaces
 * 
 * Standard Gauge: Ports (abstraction layer)
 * 
 * Connection: Defines interfaces that gateways must implement
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export interface Port<T = unknown> {
  execute(input: unknown): Promise<T>;
}

export abstract class BasePort<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext
> {
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
}