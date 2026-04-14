/**
 * noware-domains - Domain Types
 * 
 * Standard Gauge: Domain Types (Tier 3)
 * 
 * Connection: Defines core domain types
 */

import type { RequestLike, ContextLike } from "noware-shared";

export type Entity<T = unknown> = {
  id: string;
} & T;

export type ValueObject<T = unknown> = T;

export class EntityFactory {
  constructor(
    protected request?: RequestLike,
    protected env?: Record<string, unknown>,
    protected ctx?: ContextLike,
  ) {}
}