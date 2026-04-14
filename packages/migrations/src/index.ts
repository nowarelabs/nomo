/**
 * noware-migrations - Migration
 *
 * Standard Gauge: Migration System (Tier 1)
 *
 * Connection: Used by BasePersistence for schema changes
 */

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class Migration {
  constructor(
    protected request: RequestLike,
    protected env: Record<string, unknown>,
    protected ctx: ContextLike,
  ) {}

  abstract up(): Promise<void>;
  abstract down(): Promise<void>;
}
