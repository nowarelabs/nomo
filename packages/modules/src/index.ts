/**
 * noware-modules - BaseModule
 * 
 * Standard Gauge: Bounded Context Container (Tier 2)
 * 
 * Connection Flow:
 * BaseContext → BaseModule → BaseFeatureHandler
 * 
 * Connection: This layer → BaseFeatureHandler (ONE call only)
 * 
 * Static Plugin Points:
 * - handlers: Map<string, BaseFeatureHandler>
 */

export abstract class BaseModule<Env = unknown, Ctx = unknown> {
  constructor(protected env: Env, protected ctx: Ctx) {}
  
  async load(): Promise<void> {}
  async unload(): Promise<void> {}
}