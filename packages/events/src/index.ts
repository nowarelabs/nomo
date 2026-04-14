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

import type { RequestLike, ContextLike } from "noware-shared";

export class EventEmitter {
  constructor(
    protected request: RequestLike,
    protected env: Record<string, unknown>,
    protected ctx: ContextLike,
  ) {}
  
  on(event: string, handler: unknown): void {}
  emit(event: string, data: unknown): void {}
}