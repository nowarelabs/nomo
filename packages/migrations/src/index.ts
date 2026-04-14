/**
 * noware-migrations - Migration
 * 
 * Standard Gauge: Migration System (Tier 1)
 * 
 * Connection: Used by BasePersistence for schema changes
 */

export abstract class Migration {
  abstract up(): Promise<void>;
  abstract down(): Promise<void>;
}