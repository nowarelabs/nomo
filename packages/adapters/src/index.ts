/**
 * noware-adapters - Adapters
 * 
 * Standard Gauge: Adapters (implementation layer)
 * 
 * Connection: Defines interfaces that gateways must implement
 */

import type { RequestLike, ContextLike } from "noware-shared";

export interface Adapter<T = unknown> {
  execute(input: unknown): Promise<T>;
}

export abstract class BaseAdapter<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike
> {
  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
}