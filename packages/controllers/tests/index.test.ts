import { describe, expect, test, vi } from "vite-plus/test";
import { BaseController } from "../src/index.ts";

describe("BaseController", () => {
  class TestController extends BaseController {
    protected service = {};
    
    protected getService() {
      return this.service;
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as any;
    
    const controller = new TestController(mockRequest, mockEnv, mockCtx);
    
    expect(controller).toBeDefined();
    expect(controller.request).toBe(mockRequest);
    expect(controller.env).toBe(mockEnv);
    expect(controller.ctx).toBe(mockCtx);
  });
  
  test("getService returns the service", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const controller = new TestController(mockRequest, mockEnv, mockCtx);
    
    expect(controller.getService()).toEqual({});
  });
  
  test("runAction throws error when not implemented", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const controller = new TestController(mockRequest, mockEnv, mockCtx);
    
    await expect(controller.runAction("index")).rejects.toThrow("Not implemented");
  });
  
  test("static plugin points exist", () => {
    expect(BaseController.beforeActions).toBeDefined();
    expect(BaseController.afterActions).toBeDefined();
  });
});