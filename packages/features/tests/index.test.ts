import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { BaseFeatureHandler } from "../src/index.ts";

describe("BaseFeatureHandler", () => {
  class TestFeatureHandler extends BaseFeatureHandler {
    async handle(input: unknown) {
      return { result: input };
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const handler = new TestFeatureHandler(mockRequest, mockEnv, mockCtx);
    
    expect(handler).toBeDefined();
    expect(handler.request).toBe(mockRequest);
    expect(handler.env).toBe(mockEnv);
    expect(handler.ctx).toBe(mockCtx);
  });
  
  test("handle can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const handler = new TestFeatureHandler(mockRequest, mockEnv, mockCtx);
    
    const result = await handler.handle("test input");
    expect(result).toEqual({ result: "test input" });
  });
  
  test("static controllers map exists", () => {
    expect(BaseFeatureHandler.controllers).toBeDefined();
  });
});