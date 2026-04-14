import { describe, expect, test, vi } from "vite-plus/test";
import { BaseRpcServer } from "../src/index.ts";

describe("BaseRpcServer", () => {
  class TestRpcServer extends BaseRpcServer {
    async handle(request: globalThis.Request) {
      return new Response("OK");
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as any;
    
    const server = new TestRpcServer(mockRequest, mockEnv, mockCtx);
    
    expect(server).toBeDefined();
    expect(server.request).toBe(mockRequest);
    expect(server.env).toBe(mockEnv);
  });
  
  test("handle can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const server = new TestRpcServer(mockRequest, mockEnv, mockCtx);
    
    const response = await server.handle(mockRequest);
    expect(response.status).toBe(200);
  });
  
  test("static handlers map exists", () => {
    expect(BaseRpcServer.handlers).toBeDefined();
  });
});