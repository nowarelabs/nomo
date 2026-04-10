import { Logger, LogLevel } from "nomo/logger";
import { context, propagation } from "@opentelemetry/api";

export abstract class BaseJob<T = unknown> {
  constructor(protected params: T) {}
  abstract perform(ctx?: unknown): Promise<void>;
}

export abstract class QueueJob<T = unknown> extends BaseJob<T> {
  static async performLater<T extends { new (...args: unknown[]): unknown }>(
    this: T,
    queue: unknown,
    params: unknown,
  ) {
    const logger = new Logger({ service: "jobs", level: LogLevel.DEBUG });
    logger.info(`Enqueuing job ${this.name}`, { params });

    const traceContext: Record<string, string> = {};
    propagation.inject(context.active(), traceContext);

    await queue.send({
      type: "job",
      jobName: this.name,
      params,
      traceContext,
    });
  }

  static async performNow<T extends { new (...args: unknown[]): unknown }>(this: T, params: unknown) {
    const job = new (this as unknown)(params);
    await job.perform();
  }
}

export abstract class WorkflowJob<T = unknown> extends BaseJob<T> {
  static async performLater<T extends { new (...args: unknown[]): unknown }>(
    this: T,
    workflow: unknown,
    params: unknown,
    options?: unknown,
  ) {
    const logger = new Logger({ service: "jobs", level: LogLevel.DEBUG });
    logger.info(`Creating workflow ${this.name}`, { params, options });

    const traceContext: Record<string, string> = {};
    propagation.inject(context.active(), traceContext);

    await workflow.create({
      id: options?.id,
      params: {
        jobName: this.name,
        params,
        traceContext,
      },
    });
  }

  async step<R>(name: string, callback: () => Promise<R>, ctx: unknown): Promise<R> {
    return await ctx.step.do(name, callback);
  }

  async sleep(seconds: number, ctx: unknown): Promise<void> {
    await ctx.step.sleep(`sleep_${seconds}s`, seconds);
  }
}

export * from "./handler";
