import { describe, expect, test, vi } from "vite-plus/test";
import { Maintenance } from "../src/index.ts";

describe("Maintenance", () => {
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as any;
    
    const maintenance = new Maintenance(mockRequest, mockEnv, mockCtx);
    
    expect(maintenance).toBeDefined();
  });
  
  test("healthCheck returns true by default", async () => {
    const maintenance = new Maintenance(new Request("http://localhost"), {}, {});
    const result = await maintenance.healthCheck();
    expect(result).toBe(true);
  });
});