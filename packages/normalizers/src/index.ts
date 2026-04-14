/**
 * noware-normalizers - BaseNormalizer
 * 
 * Standard Gauge: Normalizer (middleware)
 * 
 * Connection: Used by controllers to normalize input
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export interface Normalizer<T = unknown> {
  normalize(data: unknown): T;
}

export abstract class BaseNormalizer<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext
> {
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
}