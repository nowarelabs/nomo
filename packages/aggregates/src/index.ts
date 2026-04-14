/**
 * noware-aggregates - BaseAggregate
 * 
 * Standard Gauge: Event Sourcing Consistency Boundary (Tier 2)
 * 
 * Connection Flow:
 * BaseService → BaseAggregate → EventStore
 * 
 * Connection: This layer → EventStore (ONE call only)
 * 
 * Static Plugin Points:
 * - commandHandlers: Array<(aggregate, command) => void>
 * - eventAppliers: Array<(event) => void>
 */

export abstract class BaseAggregate<State = unknown, Event = unknown> {
  protected state: State = {} as State;
  protected events: Event[] = [];
  
  constructor(protected id: string) {}
  
  protected apply(event: Event): void {
    this.events.push(event);
  }
  
  getEvents(): Event[] {
    return this.events;
  }
}