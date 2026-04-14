/**
 * noware-serializers - Serializers
 * 
 * Standard Gauge: Serializers (Tier 1)
 * 
 * Connection: Serialize/deserialize data
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class Serializer {
  constructor(
    protected request?: Request,
    protected env?: Record<string, unknown>,
    protected ctx?: ExecutionContext,
  ) {}
  
  serialize(data: unknown): string {
    return JSON.stringify(data);
  }
  
  deserialize(data: string): unknown {
    return JSON.parse(data);
  }
}
