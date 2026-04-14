/**
 * noware-durable-objects - DurableObject Utilities
 * 
 * Standard Gauge: Durable Object Utilities (Tier 1)
 * 
 * Connection: Used for Cloudflare Durable Objects
 */

export abstract class DurableObject {
  constructor(protected state: unknown, protected env: unknown) {}
  
  async fetch(request: Request): Promise<Response> {
    throw new Error("Not implemented");
  }
}