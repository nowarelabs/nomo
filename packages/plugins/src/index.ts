/**
 * noware-plugins - Plugin Registry
 * 
 * Standard Gauge: Plugin System (infrastructure)
 * 
 * Connection: Extends functionality at static points
 */

import type { RequestLike, ContextLike } from "noware-shared";

export interface Plugin {
  name: string;
  install(): void;
}

export abstract class PluginRegistry<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike
> {
  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  static plugins: Plugin[] = [];
  
  static register(plugin: Plugin): void {
    this.plugins.push(plugin);
  }
}