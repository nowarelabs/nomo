/**
 * noware-gateways - Gateway Implementations
 * 
 * Standard Gauge: Gateways (port implementations)
 * 
 * Connection: Implements Port interfaces from noware-ports
 */

export abstract class Gateway<PortInterface = unknown> {
  async execute(input: unknown): Promise<unknown> {
    throw new Error("Not implemented");
  }
}