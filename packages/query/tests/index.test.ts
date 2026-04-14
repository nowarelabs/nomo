import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { BaseQueryProjection } from "../src/index.ts";

describe("BaseQueryProjection", () => {
  class TestProjection extends BaseQueryProjection {
    async onEvent(event: unknown) {}
    async materialize(entityId: string) {
      return { id: entityId };
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const projection = new TestProjection(mockRequest, mockEnv, mockCtx);
    
    expect(projection).toBeDefined();
    expect(projection.request).toBe(mockRequest);
    expect(projection.env).toBe(mockEnv);
  });
  
  test("onEvent can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const projection = new TestProjection(mockRequest, mockEnv, mockCtx);
    
    await expect(projection.onEvent({ type: "test" })).resolves.toBeUndefined();
  });
  
  test("materialize can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const projection = new TestProjection(mockRequest, mockEnv, mockCtx);
    const result = await projection.materialize("entity-1");
    expect(result).toEqual({ id: "entity-1" });
  });
  
  test("static eventHandlers exist", () => {
    expect(BaseQueryProjection.eventHandlers).toBeDefined();
  });
});