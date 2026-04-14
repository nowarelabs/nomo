/**
 * noware-gateways - Gateway Implementations
 * 
 * Standard Gauge: Gateways (port implementations)
 * 
 * Connection: Implements Port interfaces from noware-ports
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class Gateway<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext,
  PortInterface = unknown
> {
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  async execute(input: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }
}