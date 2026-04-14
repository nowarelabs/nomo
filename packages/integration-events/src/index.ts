/**
 * noware-integration-events - Integration Events
 * 
 * Standard Gauge: Integration Events (Tier 2)
 * 
 * Connection: External system event handlers
 */

import type { Request, ExecutionContext } from "@cloudflare/workers-types";

export interface IntegrationEvent {
  type: string;
  payload: unknown;
  source: string;
  timestamp: Date;
}

export abstract class BaseIntegrationHandler {
  constructor(
    protected request: Request,
    protected env: Record<string, unknown>,
    protected ctx: ExecutionContext,
  ) {}
}