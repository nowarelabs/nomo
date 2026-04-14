/**
 * noware-validators - BaseValidator
 * 
 * Standard Gauge: Validator (middleware)
 * 
 * Connection: Used by controllers to validate input
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export interface Validator<T = unknown> {
  validate(data: unknown): T;
}

export abstract class BaseValidator<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext
> {
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
}