import { describe, expect, test, vi } from "vite-plus/test";
import { Result, ok, err, ResultFactory } from "../src/index.ts";

describe("Result", () => {
  describe("ok", () => {
    test("creates successful result", () => {
      const result = ok("test value");
      expect(result.ok).toBe(true);
      expect(result.value).toBe("test value");
    });
  });
  
  describe("err", () => {
    test("creates error result", () => {
      const result = err("test error");
      expect(result.ok).toBe(false);
      expect(result.error).toBe("test error");
    });
  });
  
  describe("ResultFactory", () => {
    test("constructor accepts optional params", () => {
      const factory = new ResultFactory();
      expect(factory).toBeDefined();
    });
    
    test("constructor accepts request, env, ctx", () => {
      const mockRequest = new Request("http://localhost");
      const mockEnv = {} as Record<string, unknown>;
      const mockCtx = {} as any;
      
      const factory = new ResultFactory(mockRequest, mockEnv, mockCtx);
      expect(factory).toBeDefined();
    });
  });
});