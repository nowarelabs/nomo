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

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class BaseView {
  constructor(
    protected request: RequestLike,
    protected env: Record<string, unknown>,
    protected ctx: ContextLike,
  ) {}
  
  static render(data: unknown, assets?: unknown): string {
    return "";
  }
}