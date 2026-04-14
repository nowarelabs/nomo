/**
 * noware-contexts - BaseContext
 *
 * Standard Gauge: Bounded Context Container (Tier 2)
 *
 * Connection Flow:
 * BaseContext → BaseModule (multiple allowed)
 *
 * Connection: This layer → BaseModule[] (multiple allowed)
 *
 * Static Plugin Points:
 * - modules: Map<string, BaseModule>
 */

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class BaseContext<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike,
> {
  static modules: Map<string, unknown> = new Map();
  
  protected modules: Map<string, unknown> = new Map();

  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}

  async loadModule(name: string, module: unknown): Promise<void> {
    this.modules.set(name, module);
  }
}
