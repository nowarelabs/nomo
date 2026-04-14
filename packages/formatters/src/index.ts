/**
 * noware-formatters - BaseFormatter
 * 
 * Standard Gauge: Formatter (middleware)
 * 
 * Connection: Used by controllers to format output
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export interface Formatter<T = unknown> {
  format(data: unknown): T;
}

export abstract class BaseFormatter<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext
> {
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
}