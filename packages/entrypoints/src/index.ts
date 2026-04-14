/**
 * noware-entrypoints - BaseWorker
 * 
 * Standard Gauge: Worker Entry Point (Tier 2)
 * 
 * Connection: Handles incoming requests, delegates to Router
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export abstract class BaseWorker<
  Env extends Record<string, unknown> = Record<string, unknown>
> {
  abstract fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response>;
}