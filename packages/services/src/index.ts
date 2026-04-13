/**
 * noware-services - BaseService
 * 
 * Standard Gauge: Service layer (S in RCSM)
 * 
 * Connection Flow:
 * BaseController → BaseService → BaseModel → BasePersistence
 * 
 * Connection: This layer → BaseModel (RCSM - ONE call only)
 */

import { Logger } from "../logger/index.ts";
import type { ExecutionContext, D1Database } from "@cloudflare/workers-types";
import type { RouterContext, RouterContextSource } from "../router/index.ts";

export type { RouterContextSource };

/* ============================================================================
 * BaseService
 * 
 * Connection: This layer → BaseModel (RCSM - ONE call only)
 * ============================================================================ */

export abstract class BaseService<
  Env = unknown, 
  Ctx = ExecutionContext
> {
  // Static plugin points
  static beforeCreates: Array<(data: unknown) => Promise<unknown>> = [];
  static afterCreates: Array<(entity: unknown) => Promise<void>> = [];
  static beforeUpdates: Array<(id: string, data: unknown) => Promise<unknown>> = [];
  static afterUpdates: Array<(entity: unknown) => Promise<void>> = [];
  static beforeDeletes: Array<(id: string) => Promise<void>> = [];
  static afterDeletes: Array<(id: string) => Promise<void>> = [];

  /**
   * Constructor (expected input)
   */
  constructor(
    protected req: Request,
    protected env: Env,
    protected ctx: RouterContext<Env, Ctx>,
  ) {}

  protected get logger(): Logger {
    return (
      this.ctx.logger ||
      new Logger({
        service: "services",
        context: {
          service_name: this.constructor.name,
          source: this.ctx.source,
        },
      })
    );
  }

  // HTTP fetching (external calls)
  protected async fetch(input: string | Request | URL, init?: RequestInit): Promise<Response> {
    return this.ctx.fetch(input, init);
  }

  protected get db(): D1Database {
    return (this.env as Record<string, unknown>).DB as D1Database;
  }

  // Create child context for nested operations
  protected createServiceContext(
    serviceName: string,
    metadata?: Record<string, unknown>,
  ): RouterContext<Env, Ctx> {
    const newCtx = { ...this.ctx } as RouterContext<Env, Ctx>;
    newCtx.source = "service";
    newCtx.sourceMetadata = {
      ...this.ctx.sourceMetadata,
      parent_service: this.constructor.name,
      child_service: serviceName,
      ...metadata,
    };
    return newCtx;
  }
}

export type { ExecutionContext };
