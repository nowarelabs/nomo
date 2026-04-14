/**
 * noware-dtos - Data Transfer Objects
 * 
 * Standard Gauge: DTOs (Tier 3)
 * 
 * Connection: Define data transfer structures
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class Dto {
  constructor(
    protected request?: Request,
    protected env?: Record<string, unknown>,
    protected ctx?: ExecutionContext,
  ) {}
  
  toJSON(): Record<string, unknown> {
    return {};
  }
  
  static fromJSON(data: Record<string, unknown>): Dto {
    return new Dto();
  }
}
