/**
 * noware-result - Result Type
 * 
 * Standard Gauge: Result Type (Tier 1 - infrastructure)
 * 
 * Connection: Used by all layers for error handling
 */

import type { RequestLike, ContextLike } from "noware-shared";

export type Result<T> = 
  | { ok: true; value: T }
  | { ok: false; error: string };

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err<T>(error: string): Result<T> {
  return { ok: false, error };
}

export class ResultFactory {
  constructor(
    protected request?: RequestLike,
    protected env?: Record<string, unknown>,
    protected ctx?: ContextLike,
  ) {}
}