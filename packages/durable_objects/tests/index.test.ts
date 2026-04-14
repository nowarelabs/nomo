import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext, DurableObjectState } from "@cloudflare/workers-types";
import { DurableObject } from "../src/index.ts";

describe("DurableObject", () => {
  class TestDO extends DurableObject {
    async fetch(request: Request) {
      return new Response("OK");
    }
  }
  
  test("constructor accepts state, env, request, ctx", () => {
    const mockState = {} as DurableObjectState;
    const mockEnv = {} as Record<string, unknown>;
    const mockRequest = new Request("http://localhost");
    const mockCtx = {} as ExecutionContext;
    
    const doInstance = new TestDO(mockState, mockEnv, mockRequest, mockCtx);
    
    expect(doInstance).toBeDefined();
  });
  
  test("fetch can be overridden", async () => {
    const mockState = {} as DurableObjectState;
    const mockEnv = {} as Record<string, unknown>;
    const mockRequest = new Request("http://localhost");
    const mockCtx = {} as ExecutionContext;
    
    const doInstance = new TestDO(mockState, mockEnv, mockRequest, mockCtx);
    
    const response = await doInstance.fetch(mockRequest);
    expect(response.status).toBe(200);
  });
});