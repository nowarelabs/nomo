/**
 * noware-integration-events - Integration Events
 * 
 * Standard Gauge: Integration Events (Tier 2)
 * 
 * Connection: External system event handlers
 */

export interface IntegrationEvent {
  type: string;
  payload: unknown;
  source: string;
  timestamp: Date;
}