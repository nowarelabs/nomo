/**
 * noware-formatters - BaseFormatter
 * 
 * Standard Gauge: Formatter (middleware)
 * 
 * Connection: Used by controllers to format output
 */

export interface Formatter<T = unknown> {
  format(data: unknown): T;
}