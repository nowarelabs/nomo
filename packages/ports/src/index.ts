/**
 * noware-ports - Port Interfaces
 * 
 * Standard Gauge: Ports (abstraction layer)
 * 
 * Connection: Defines interfaces that gateways must implement
 */

export interface Port<T = unknown> {
  execute(input: unknown): Promise<T>;
}