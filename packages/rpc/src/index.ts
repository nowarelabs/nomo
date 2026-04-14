/**
 * noware-rpc - BaseRpcServer
 *
 * Standard Gauge: RPC Server (Tier 2)
 *
 * Connection Flow:
 * BaseRpcServer → BaseFeatureHandler → BaseController
 *
 * Connection: This layer → BaseFeatureHandler (ONE call only)
 *
 * Static Plugin Points:
 * - handlers: Map<string, BaseFeatureHandler>
 */

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class BaseRpcServer<
  Env extends Record<string, unknown> = Record<string, unknown>,
  Ctx extends ContextLike = ContextLike,
> {
  static handlers: Map<string, unknown> = new Map();

  constructor(
    protected request: RequestLike,
    protected env: Env,
    protected ctx: Ctx,
  ) {}

  async handle(_request: Request): Promise<Response> {
    throw new Error("Not implemented");
  }
}
