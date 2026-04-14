import { describe, expect, test, vi } from "vite-plus/test";
import { Gateway } from "../src/index.ts";

describe("Gateway", () => {
  class TestGateway extends Gateway {
    async execute(input: unknown) {
      return { result: input };
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as any;
    
    const gateway = new TestGateway(mockRequest, mockEnv, mockCtx);
    
    expect(gateway).toBeDefined();
  });
  
  test("execute can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const gateway = new TestGateway(mockRequest, mockEnv, mockCtx);
    const result = await gateway.execute("input");
    expect(result).toEqual({ result: "input" });
  });
  
  test("execute throws error when not implemented", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const gateway = new Gateway(mockRequest, mockEnv, mockCtx);
    
    await expect(gateway.execute("input")).rejects.toThrow("Not implemented");
  });
});