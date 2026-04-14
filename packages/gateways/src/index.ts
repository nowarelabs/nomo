/**
 * noware-gateways - Gateway Implementations
 * 
 * Standard Gauge: Gateways (port implementations)
 * 
 * Connection: Implements Port interfaces from noware-ports
 */

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class Gateway<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike,
  PortInterface = unknown
> {
  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  async execute(input: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }
}