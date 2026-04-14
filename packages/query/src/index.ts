/**
 * noware-query - BaseQueryProjection
 * 
 * Standard Gauge: CQRS Read Side (Tier 2)
 * 
 * Connection Flow:
 * BaseRpcServer → BaseQueryProjection → BasePersistence
 * 
 * Connection: This layer → BasePersistence (RCSM - ONE call only)
 * 
 * Static Plugin Points:
 * - eventHandlers: Array<(event) => void>
 */

export abstract class BaseQueryProjection<Env = unknown, Ctx = unknown> {
  constructor(protected env: Env, protected ctx: Ctx) {}
  
  async onEvent(event: unknown): Promise<void> {}
  
  async materialize(entityId: string): Promise<unknown> {
    return null;
  }
}