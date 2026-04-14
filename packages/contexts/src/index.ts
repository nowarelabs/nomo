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

export abstract class BaseContext<Env = unknown, Ctx = unknown> {
  protected modules: Map<string, unknown> = new Map();
  
  constructor(protected env: Env, protected ctx: Ctx) {}
  
  async loadModule(name: string, module: unknown): Promise<void> {
    this.modules.set(name, module);
  }
}