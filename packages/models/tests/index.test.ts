import { describe, expect, test, vi } from "vite-plus/test";
import { BaseModel } from "../src/index.ts";

describe("BaseModel", () => {
  class TestModel extends BaseModel {
    protected persistence = {};
    
    protected getPersistence() {
      return this.persistence;
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as any;
    
    const model = new TestModel(mockRequest, mockEnv, mockCtx);
    
    expect(model).toBeDefined();
    expect(model.request).toBe(mockRequest);
    expect(model.env).toBe(mockEnv);
    expect(model.ctx).toBe(mockCtx);
  });
  
  test("getPersistence returns the persistence", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const model = new TestModel(mockRequest, mockEnv, mockCtx);
    
    expect(model.getPersistence()).toEqual({});
  });
  
  test("static columnTypes exist", () => {
    expect(BaseModel.columnTypes).toBeDefined();
  });
  
  test("static relations exist", () => {
    expect(BaseModel.relations).toBeDefined();
  });
});