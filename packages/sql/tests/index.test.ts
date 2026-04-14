import { describe, expect, test } from "vite-plus/test";
import type { ContextLike } from "noware-shared";
import { QueryBuilder } from "../src/index.ts";

describe("QueryBuilder", () => {
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as Record<string, unknown>;
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;

    const builder = new QueryBuilder(mockRequest, mockEnv, mockCtx);

    expect(builder).toBeDefined();
  });

  test("toSql returns empty string by default", () => {
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;
    const builder = new QueryBuilder(new Request("http://localhost"), {}, mockCtx);
    expect(builder.toSql()).toBe("");
  });
});
