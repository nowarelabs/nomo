/**
 * noware-sql - Query Builder
 * 
 * Standard Gauge: SQL Builder (Tier 1)
 * 
 * Connection: Used by BasePersistence for database queries
 */

import type { RequestLike, ContextLike } from "noware-shared";

export class QueryBuilder {
  constructor(
    protected request: RequestLike,
    protected env: Record<string, unknown>,
    protected ctx: ContextLike,
  ) {}
  
  toSql(): string {
    return "";
  }
}