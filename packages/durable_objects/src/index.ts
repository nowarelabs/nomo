/**
 * noware-durable-objects - DurableObject Utilities
 * 
 * Standard Gauge: Durable Object Utilities (Tier 1)
 * 
 * Connection: Used for Cloudflare Durable Objects
 */

import type { Request, ExecutionContext, DurableObjectState } from "@cloudflare/workers-types";

export abstract class DurableObject {
  constructor(
    protected state: DurableObjectState,
    protected env: Record<string, unknown>,
    protected request?: Request,
    protected ctx?: ExecutionContext,
  ) {}
  
  async fetch(request: Request): Promise<Response> {
    throw new Error("Not implemented");
  }
}