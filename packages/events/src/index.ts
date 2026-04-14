/**
 * noware-events - EventEmitter
 * 
 * Standard Gauge: Event System (infrastructure)
 * 
 * Connection: This package dispatches events to handlers
 * 
 * Static Plugin Points:
 * - handlers: Map<string, EventHandler[]>
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export class EventEmitter {
  constructor(
    protected request: Request,
    protected env: Record<string, unknown>,
    protected ctx: ExecutionContext,
  ) {}
  
  on(event: string, handler: unknown): void {}
  emit(event: string, data: unknown): void {}
}