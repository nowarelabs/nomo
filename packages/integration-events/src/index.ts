/**
 * noware-integration-events - Integration Events
 *
 * Standard Gauge: Integration Events (Tier 2)
 *
 * Connection: External system event handlers
 */

import type { RequestLike, ContextLike } from "noware-shared";

export interface IntegrationEvent {
  type: string;
  payload: unknown;
  source: string;
  timestamp: Date;
}

export abstract class BaseIntegrationHandler {
  constructor(
    protected request: RequestLike,
    protected env: Record<string, unknown>,
    protected ctx: ContextLike,
  ) {}
}
