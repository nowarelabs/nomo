/**
 * noware-entrypoints - BaseWorker
 *
 * Standard Gauge: Worker Entry Point (Tier 2)
 *
 * Connection: Handles incoming requests, delegates to Router
 */

import type { RequestLike, ContextLike } from "noware-shared";

export abstract class BaseWorker<Env extends Record<string, unknown> = Record<string, unknown>> {
  abstract fetch(request: RequestLike, env: Env, ctx: ContextLike): Promise<Response>;
}
