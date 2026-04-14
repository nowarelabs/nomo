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

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class BaseAggregate<
  State = unknown,
  Event = unknown,
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext
> {
  protected state: State = {} as State;
  protected events: Event[] = [];
  
  constructor(
    protected id: string,
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  protected apply(event: Event): void {
    this.events.push(event);
  }
  
  getEvents(): Event[] {
    return this.events;
  }
}