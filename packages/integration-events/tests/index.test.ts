import { describe, expect, test, vi } from "vite-plus/test";
import { IntegrationEvent, BaseIntegrationHandler } from "../src/index.ts";

describe("IntegrationEvent", () => {
  test("IntegrationEvent interface requires type, payload, source, timestamp", () => {
    const event: IntegrationEvent = {
      type: "user.created",
      payload: { userId: "123" },
      source: "auth-service",
      timestamp: new Date(),
    };

    expect(event.type).toBe("user.created");
    expect(event.payload).toEqual({ userId: "123" });
    expect(event.source).toBe("auth-service");
  });
});

describe("BaseIntegrationHandler", () => {
  class TestHandler extends BaseIntegrationHandler {
    handle(event: IntegrationEvent) {
      return { processed: true };
    }
  }

  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as any;

    const handler = new TestHandler(mockRequest, mockEnv, mockCtx);

    expect(handler).toBeDefined();
  });

  test("handle can be implemented", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as any;

    const handler = new TestHandler(mockRequest, mockEnv, mockCtx);
    const event: IntegrationEvent = {
      type: "test",
      payload: {},
      source: "test",
      timestamp: new Date(),
    };

    const result = handler.handle(event);
    expect(result).toEqual({ processed: true });
  });
});
