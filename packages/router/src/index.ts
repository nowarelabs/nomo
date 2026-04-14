/**
 * noware-router - BaseRouter
 *
 * Standard Gauge: Router (Tier 2)
 *
 * Connection Flow:
 * BaseRouter → BaseRpcServer → BaseFeatureHandler
 *
 * Connection: This layer → BaseRpcServer (ONE call only)
 *
 * Static Plugin Points:
 * - routes: RouteConfig[]
 */

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class BaseRouter<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike,
> {
  static routes: unknown[] = [];

  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}

  async handle(_request: RequestLike): Promise<Response> {
    throw new Error("Not implemented");
  }
}
