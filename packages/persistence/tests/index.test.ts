import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { BasePersistence } from "../src/index.ts";

describe("BasePersistence", () => {
  class TestPersistence extends BasePersistence {
    protected async connect() {}
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const persistence = new TestPersistence(mockRequest, mockEnv, mockCtx);
    
    expect(persistence).toBeDefined();
    expect(persistence.request).toBe(mockRequest);
    expect(persistence.env).toBe(mockEnv);
    expect(persistence.ctx).toBe(mockCtx);
  });
  
  test("connect method exists", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const persistence = new TestPersistence(mockRequest, mockEnv, mockCtx);
    
    await expect(persistence.connect()).resolves.toBeUndefined();
  });
  
  test("static migrations exist", () => {
    expect(BasePersistence.migrations).toBeDefined();
  });
  
  test("static dialects exist", () => {
    expect(BasePersistence.dialects).toBeDefined();
  });
});