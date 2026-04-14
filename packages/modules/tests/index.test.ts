import { describe, expect, test, vi } from "vite-plus/test";
import { BaseModule } from "../src/index.ts";

describe("BaseModule", () => {
  class TestModule extends BaseModule {
    async load() {
      return;
    }
    async unload() {
      return;
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as any;
    
    const module = new TestModule(mockRequest, mockEnv, mockCtx);
    
    expect(module).toBeDefined();
    expect(module.request).toBe(mockRequest);
  });
  
  test("load can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const module = new TestModule(mockRequest, mockEnv, mockCtx);
    
    await expect(module.load()).resolves.toBeUndefined();
  });
  
  test("unload can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const module = new TestModule(mockRequest, mockEnv, mockCtx);
    
    await expect(module.unload()).resolves.toBeUndefined();
  });
  
  test("static handlers map exists", () => {
    expect(BaseModule.handlers).toBeDefined();
  });
});