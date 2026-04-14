/**
 * noware-adapters - Adapters
 * 
 * Standard Gauge: Adapters (implementation layer)
 * 
 * Connection: Defines interfaces that gateways must implement
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export interface Adapter<T = unknown> {
  execute(input: unknown): Promise<T>;
}

export abstract class BaseAdapter<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext
> {
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
}