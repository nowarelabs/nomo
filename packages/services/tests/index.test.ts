import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { BaseService } from "../src/index.ts";

describe("BaseService", () => {
  class TestService extends BaseService {
    protected model = {};
    
    protected getModel() {
      return this.model;
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const service = new TestService(mockRequest, mockEnv, mockCtx);
    
    expect(service).toBeDefined();
    expect(service.request).toBe(mockRequest);
    expect(service.env).toBe(mockEnv);
    expect(service.ctx).toBe(mockCtx);
  });
  
  test("getModel returns the model", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const service = new TestService(mockRequest, mockEnv, mockCtx);
    
    expect(service.getModel()).toEqual({});
  });
  
  test("static hooks exist", () => {
    expect(BaseService.hooks).toBeDefined();
  });
});