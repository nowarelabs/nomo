/**
 * noware-normalizers - BaseNormalizer
 *
 * Standard Gauge: Normalizer (middleware)
 *
 * Connection: Used by controllers to normalize input
 */

import type { RequestLike, ContextLike } from "noware-shared";

export interface Normalizer<T = unknown> {
  normalize(data: unknown): T;
}

export abstract class BaseNormalizer<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike,
> {
  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
}
