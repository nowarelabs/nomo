import { describe, expect, test, vi } from "vite-plus/test";
import { Port, BasePort } from "../src/index.ts";

describe("Port", () => {
  test("Port interface requires execute method", () => {
    const port: Port<string> = {
      execute: async (input: unknown) => "result",
    };
    
    expect(port.execute).toBeDefined();
  });
});

describe("BasePort", () => {
  class TestPort extends BasePort {
    async execute(input: unknown) {
      return "result";
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as any;
    
    const port = new TestPort(mockRequest, mockEnv, mockCtx);
    
    expect(port).toBeDefined();
  });
  
  test("execute can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const port = new TestPort(mockRequest, mockEnv, mockCtx);
    const result = await port.execute("input");
    expect(result).toBe("result");
  });
});