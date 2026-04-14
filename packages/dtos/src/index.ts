/**
 * noware-dtos - Data Transfer Objects
 *
 * Standard Gauge: DTOs (Tier 3)
 *
 * Connection: Define data transfer structures
 */

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class Dto {
  constructor(
    protected request?: RequestLike,
    protected env?: Record<string, unknown>,
    protected ctx?: ContextLike,
  ) {}

  toJSON(): Record<string, unknown> {
    return {};
  }

  static fromJSON(data: Record<string, unknown>): Dto {
    return new Dto();
  }
}
