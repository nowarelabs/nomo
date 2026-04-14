import { describe, expect, test } from "vite-plus/test";
import type { ContextLike } from "noware-shared";
import { BasePersistence } from "../src/index.ts";

describe("BasePersistence", () => {
  class TestPersistence extends BasePersistence {
    protected async connect() {}
  }

  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as Record<string, unknown>;
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;

    const persistence = new TestPersistence(mockRequest, mockEnv, mockCtx);

    expect(persistence).toBeDefined();
    expect((persistence as unknown as { request: Request }).request).toBe(mockRequest);
    expect((persistence as unknown as { env: Record<string, unknown> }).env).toBe(mockEnv);
    expect((persistence as unknown as { ctx: ContextLike }).ctx).toBe(mockCtx);
  });

  test("connect method exists", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;

    const persistence = new TestPersistence(mockRequest, mockEnv, mockCtx);

    await expect(
      (persistence as unknown as { connect: () => Promise<void> }).connect(),
    ).resolves.toBeUndefined();
  });

  test("static migrations exist", () => {
    expect(BasePersistence.migrations).toBeDefined();
  });

  test("static dialects exist", () => {
    expect(BasePersistence.dialects).toBeDefined();
  });
});
