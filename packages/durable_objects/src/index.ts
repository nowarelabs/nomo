/**
 * noware-durable-objects - DurableObject Utilities
 * 
 * Standard Gauge: Durable Object Utilities (Tier 1)
 * 
 * Connection: Used for Cloudflare Durable Objects
 * 
 * Note: This package is Cloudflare-specific due to DurableObjectState.
 * Other types use noware-shared for runtime-agnostic compatibility.
 */

import type { RequestLike, ContextLike } from "noware-shared";

export type DurableObjectState = {
  id: {
    name: string;
    toString(): string;
  };
  storage: {
    get<T>(key: string): Promise<T | undefined>;
    put(key: string, value: unknown): Promise<void>;
    delete(key: string): Promise<boolean>;
    list<T>(options?: { prefix?: string; limit?: number }): Promise<{ keys: Array<{ name: string }> }>;
  };
};

export abstract class DurableObject {
  constructor(
    protected state: DurableObjectState,
    protected env: Record<string, unknown>,
    protected request?: RequestLike,
    protected ctx?: ContextLike,
  ) {}
  
  async fetch(request: RequestLike): Promise<Response> {
    throw new Error("Not implemented");
  }
}