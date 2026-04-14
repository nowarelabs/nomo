/**
 * noware-entrypoints - BaseWorker
 * 
 * Standard Gauge: Worker Entry Point (Tier 2)
 * 
 * Connection: Handles incoming requests, delegates to Router
 */

export abstract class BaseWorker<Env = unknown> {
  abstract fetch(request: Request, env: Env, ctx: unknown): Promise<Response>;
}