import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { QueryBuilder } from "../src/index.ts";

describe("QueryBuilder", () => {
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as Record<string, unknown>;
    const mockCtx = {} as ExecutionContext;
    
    const builder = new QueryBuilder(mockRequest, mockEnv, mockCtx);
    
    expect(builder).toBeDefined();
  });
  
  test("toSql returns empty string by default", () => {
    const builder = new QueryBuilder(new Request("http://localhost"), {}, {});
    expect(builder.toSql()).toBe("");
  });
});