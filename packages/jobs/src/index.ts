import { Logger, LogLevel } from "nomo/logger";
import { context, propagation } from "@opentelemetry/api";

export interface QueueSender {
  send(msg: {
    type: string;
    jobName: string;
    params: unknown;
    traceContext: Record<string, string>;
  }): Promise<void>;
}

export interface WorkflowCreator {
  create(msg: {
    id?: string;
    params: { jobName: string; params: unknown; traceContext: Record<string, string> };
  }): Promise<void>;
}

export interface WorkflowContext {
  step: {
    do<R>(name: string, callback: () => Promise<R>): Promise<R>;
    sleep(name: string, seconds: number): Promise<void>;
  };
}

export abstract class BaseJob<T = unknown> {
  constructor(protected params: T) {}
  abstract perform(ctx?: unknown): Promise<void>;
}

export abstract class QueueJob<T = unknown> extends BaseJob<T> {
  static async performLater<T extends { new (...args: unknown[]): unknown }>(
    this: T,
    queue: QueueSender,
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

  static async performNow(params: unknown) {
    const job = new (this as unknown as { new (p: unknown): BaseJob })(params);
    await job.perform();
  }
}

export abstract class WorkflowJob<T = unknown> extends BaseJob<T> {
  static async performLater<T extends { new (...args: unknown[]): unknown }>(
    this: T,
    workflow: WorkflowCreator,
    params: unknown,
    options?: { id?: string },
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

  async step<R>(name: string, callback: () => Promise<R>, ctx: WorkflowContext): Promise<R> {
    return await ctx.step.do(name, callback);
  }

  async sleep(seconds: number, ctx: WorkflowContext): Promise<void> {
    await ctx.step.sleep(`sleep_${seconds}s`, seconds);
  }
}

export * from "./handler";
