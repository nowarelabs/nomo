/**
 * noware-logger - Logger
 * 
 * Standard Gauge: Logging (Tier 1 - infrastructure)
 * 
 * Connection: Used by all layers for logging
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  constructor(config: unknown) {}
  
  debug(message: string, context?: unknown): void {}
  info(message: string, context?: unknown): void {}
  warn(message: string, context?: unknown): void {}
  error(message: string, context?: unknown): void {}
}