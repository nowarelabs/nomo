/**
 * noware-serializers - Serializers
 * 
 * Standard Gauge: Serializers (Tier 1)
 * 
 * Connection: Serialize/deserialize data
 */

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class Serializer {
  constructor(
    protected request?: RequestLike,
    protected env?: Record<string, unknown>,
    protected ctx?: ContextLike,
  ) {}
  
  serialize(data: unknown): string {
    return JSON.stringify(data);
  }
  
  deserialize(data: string): unknown {
    return JSON.parse(data);
  }
}
