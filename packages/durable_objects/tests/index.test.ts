import { describe, expect, test, vi } from "vite-plus/test";
import { DurableObject } from "../src/index.ts";

describe("DurableObject", () => {
  class TestDO extends DurableObject {
    async fetch(request: globalThis.Request) {
      return new Response("OK");
    }
  }
  
  test("constructor accepts state, env, request, ctx", () => {
    const mockState = {} as any;
    const mockEnv = {} as Record<string, unknown>;
    const mockRequest = new Request("http://localhost");
    const mockCtx = {} as any;
    
    const doInstance = new TestDO(mockState, mockEnv, mockRequest, mockCtx);
    
    expect(doInstance).toBeDefined();
  });
  
  test("fetch can be overridden", async () => {
    const mockState = {} as any;
    const mockEnv = {} as Record<string, unknown>;
    const mockRequest = new Request("http://localhost");
    const mockCtx = {} as any;
    
    const doInstance = new TestDO(mockState, mockEnv, mockRequest, mockCtx);
    
    const response = await doInstance.fetch(mockRequest);
    expect(response.status).toBe(200);
  });
});