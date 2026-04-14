import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { AssetPipeline } from "../src/index.ts";

describe("AssetPipeline", () => {
  test("constructor accepts config", () => {
    const pipeline = new AssetPipeline({ basePath: "/assets" });
    expect(pipeline).toBeDefined();
  });
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as ExecutionContext;
    
    const pipeline = new AssetPipeline({}, mockRequest, mockEnv, mockCtx);
    expect(pipeline).toBeDefined();
  });
  
  test("get returns null by default", () => {
    const pipeline = new AssetPipeline({});
    expect(pipeline.get("test.css")).toBeNull();
  });
  
  test("static loaders exist", () => {
    expect(AssetPipeline.loaders).toBeDefined();
  });
});