/**
 * noware-validators - BaseValidator
 * 
 * Standard Gauge: Validator (middleware)
 * 
 * Connection: Used by controllers to validate input
 */

import type { RequestLike, ContextLike } from "noware-shared";

export interface Validator<T = unknown> {
  validate(data: unknown): T;
}

export abstract class BaseValidator<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike
> {
  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
}