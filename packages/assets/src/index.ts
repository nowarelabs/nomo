/**
 * noware-assets - AssetPipeline
 *
 * Standard Gauge: Asset pipeline (Tier 1 - infrastructure)
 *
 * Connection: This package provides assets to views
 *
 * Static Plugin Points:
 * - loaders: Record<string, LoaderFunction>
 */

import type { RequestLike, ContextLike } from "noware-shared";

export class AssetPipeline {
  static loaders: Record<string, unknown> = {};

  constructor(
    protected config: unknown,
    protected request?: RequestLike,
    protected env?: Record<string, unknown>,
    protected ctx?: ContextLike,
  ) {}

  get(_path: string): string | null {
    return null;
  }
}
