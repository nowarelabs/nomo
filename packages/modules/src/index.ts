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

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class BaseModule<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike
> {
  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  async load(): Promise<void> {}
  async unload(): Promise<void> {}
}