/**
 * noware-views - BaseView
 * 
 * Standard Gauge: View/Template layer (Tier 3)
 * 
 * Connection: This layer consumes assets from AssetPipeline
 * 
 * Static Plugin Points:
 * - components: Map<string, ViewComponent>
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class BaseView {
  constructor(
    protected request: Request,
    protected env: Record<string, unknown>,
    protected ctx: ExecutionContext,
  ) {}
  
  static render(data: unknown, assets?: unknown): string {
    return "";
  }
}