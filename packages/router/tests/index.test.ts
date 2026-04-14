import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { BaseRouter } from "../src/index.ts";

describe("BaseRouter", () => {
  class TestRouter extends BaseRouter {
    async handle(request: Request) {
      return new Response("OK");
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const router = new TestRouter(mockRequest, mockEnv, mockCtx);
    
    expect(router).toBeDefined();
    expect(router.request).toBe(mockRequest);
    expect(router.env).toBe(mockEnv);
  });
  
  test("handle can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const router = new TestRouter(mockRequest, mockEnv, mockCtx);
    
    const response = await router.handle(mockRequest);
    expect(response.status).toBe(200);
  });
  
  test("static routes array exists", () => {
    expect(BaseRouter.routes).toBeDefined();
  });
});