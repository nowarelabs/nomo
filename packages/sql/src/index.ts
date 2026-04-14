/**
 * noware-sql - Query Builder
 * 
 * Standard Gauge: SQL Builder (Tier 1)
 * 
 * Connection: Used by BasePersistence for database queries
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export class QueryBuilder {
  constructor(
    protected request: Request,
    protected env: Record<string, unknown>,
    protected ctx: ExecutionContext,
  ) {}
  
  toSql(): string {
    return "";
  }
}