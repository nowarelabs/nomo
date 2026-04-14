/**
 * noware-formatters - BaseFormatter
 * 
 * Standard Gauge: Formatter (middleware)
 * 
 * Connection: Used by controllers to format output
 */

import type { RequestLike, ContextLike } from "noware-shared";

export interface Formatter<T = unknown> {
  format(data: unknown): T;
}

export abstract class BaseFormatter<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike
> {
  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
}