/**
 * noware-domains - Domain Types
 * 
 * Standard Gauge: Domain Types (Tier 3)
 * 
 * Connection: Defines core domain types
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export type Entity<T = unknown> = {
  id: string;
} & T;

export type ValueObject<T = unknown> = T;

export class EntityFactory {
  constructor(
    protected request?: Request,
    protected env?: Record<string, unknown>,
    protected ctx?: ExecutionContext,
  ) {}
}