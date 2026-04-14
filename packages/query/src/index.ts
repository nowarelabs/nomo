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

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class BaseQueryProjection<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike,
> {
  static eventHandlers: Array<(event: unknown) => void> = [];

  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}

  async onEvent(_event: unknown): Promise<void> {}

  async materialize(_entityId: string): Promise<unknown> {
    return null;
  }
}
