import { describe, expect, test, vi } from "vite-plus/test";
import { BaseContext } from "../src/index.ts";

describe("BaseContext", () => {
  class TestContext extends BaseContext {
    async loadModule(name: string, module: unknown) {
      super.loadModule(name, module);
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as any;
    
    const context = new TestContext(mockRequest, mockEnv, mockCtx);
    
    expect(context).toBeDefined();
    expect(context.request).toBe(mockRequest);
  });
  
  test("loadModule adds module to map", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const context = new TestContext(mockRequest, mockEnv, mockCtx);
    await context.loadModule("test-module", {});
    
    expect(context.modules.get("test-module")).toEqual({});
  });
  
  test("static modules map exists", () => {
    expect(BaseContext.modules).toBeDefined();
  });
});