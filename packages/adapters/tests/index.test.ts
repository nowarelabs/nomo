import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { Adapter, BaseAdapter } from "../src/index.ts";

describe("Adapter", () => {
  test("Adapter interface requires execute method", () => {
    const adapter: Adapter<string> = {
      execute: async (input: unknown) => "result",
    };
    
    expect(adapter.execute).toBeDefined();
  });
});

describe("BaseAdapter", () => {
  class TestAdapter extends BaseAdapter {
    async execute(input: unknown) {
      return "result";
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const adapter = new TestAdapter(mockRequest, mockEnv, mockCtx);
    
    expect(adapter).toBeDefined();
  });
  
  test("execute can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const adapter = new TestAdapter(mockRequest, mockEnv, mockCtx);
    const result = await adapter.execute("input");
    expect(result).toBe("result");
  });
});