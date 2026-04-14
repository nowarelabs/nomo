import { describe, expect, test } from "vite-plus/test";
import { BaseAggregate } from "../src/index.ts";

describe("BaseAggregate", () => {
  class TestAggregate extends BaseAggregate<{ count: number }, { type: string }> {
    protected apply(event: { type: string }) {
      super.apply(event);
    }
  }

  test("constructor accepts id, request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as Record<string, unknown>;
    const mockCtx = {} as any;

    const aggregate = new TestAggregate("agg-1", mockRequest, mockEnv, mockCtx);

    expect(aggregate).toBeDefined();
  });

  test("apply adds event to events array", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as any;

    const aggregate = new TestAggregate("agg-1", mockRequest, mockEnv, mockCtx);
    aggregate.apply({ type: "TestEvent" });

    expect(aggregate.getEvents()).toHaveLength(1);
  });

  test("getEvents returns all applied events", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as any;

    const aggregate = new TestAggregate("agg-1", mockRequest, mockEnv, mockCtx);
    aggregate.apply({ type: "Event1" });
    aggregate.apply({ type: "Event2" });

    expect(aggregate.getEvents()).toHaveLength(2);
  });

  test("static commandHandlers exist", () => {
    expect(BaseAggregate.commandHandlers).toBeDefined();
  });

  test("static eventAppliers exist", () => {
    expect(BaseAggregate.eventAppliers).toBeDefined();
  });
});
