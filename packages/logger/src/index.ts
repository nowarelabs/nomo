/**
 * noware-logger - Logger
 *
 * Standard Gauge: Logging (Tier 1 - infrastructure)
 *
 * Connection: Used by all layers for logging
 */

import type { RequestLike, ContextLike } from "noware-shared";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  constructor(
    protected config: unknown,
    protected request?: RequestLike,
    protected env?: Record<string, unknown>,
    protected ctx?: ContextLike,
  ) {}

  debug(message: string, context?: unknown): void {}
  info(message: string, context?: unknown): void {}
  warn(message: string, context?: unknown): void {}
  error(message: string, context?: unknown): void {}
}
