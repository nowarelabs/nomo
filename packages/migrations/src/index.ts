/**
 * noware-migrations - Migration
 * 
 * Standard Gauge: Migration System (Tier 1)
 * 
 * Connection: Used by BasePersistence for schema changes
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class Migration {
  constructor(
    protected request: Request,
    protected env: Record<string, unknown>,
    protected ctx: ExecutionContext,
  ) {}
  
  abstract up(): Promise<void>;
  abstract down(): Promise<void>;
}