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

export class EventEmitter {
  on(event: string, handler: unknown): void {}
  emit(event: string, data: unknown): void {}
}