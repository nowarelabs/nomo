/**
 * noware-ports - Port Interfaces
 * 
 * Standard Gauge: Ports (abstraction layer)
 * 
 * Connection: Defines interfaces that gateways must implement
 */

import type { RequestLike, ContextLike } from "noware-shared";

export interface Port<T = unknown> {
  execute(input: unknown): Promise<T>;
}

export abstract class BasePort<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike
> {
  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
}