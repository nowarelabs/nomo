import { describe, expect, test } from "vite-plus/test";
import { BaseFeatureHandler } from "../src/index.ts";

describe("BaseFeatureHandler", () => {
  class TestFeatureHandler extends BaseFeatureHandler {
    async handle(input: unknown) {
      return { result: input };
    }
  }

  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as Record<string, unknown>;
    const mockCtx = {} as any;

    const handler = new TestFeatureHandler(mockRequest, mockEnv, mockCtx);

    expect(handler).toBeDefined();
  });

  test("handle can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as any;

    const handler = new TestFeatureHandler(mockRequest, mockEnv, mockCtx);

    const result = await handler.handle("test input");
    expect(result).toEqual({ result: "test input" });
  });

  test("static controllers map exists", () => {
    expect(BaseFeatureHandler.controllers).toBeDefined();
  });
});
