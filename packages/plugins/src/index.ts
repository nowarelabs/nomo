/**
 * noware-plugins - Plugin Registry
 * 
 * Standard Gauge: Plugin System (infrastructure)
 * 
 * Connection: Extends functionality at static points
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export interface Plugin {
  name: string;
  install(): void;
}

export abstract class PluginRegistry<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ExecutionContext = ExecutionContext
> {
  constructor(
    protected request: Request,
    protected env: Env,
    protected ctx: Ctx,
  ) {}
  
  static plugins: Plugin[] = [];
  
  static register(plugin: Plugin): void {
    this.plugins.push(plugin);
  }
}