/**
 * noware-domains - Domain Types
 * 
 * Standard Gauge: Domain Types (Tier 3)
 * 
 * Connection: Defines core domain types
 */

export type Entity<T = unknown> = {
  id: string;
} & T;

export type ValueObject<T = unknown> = T;