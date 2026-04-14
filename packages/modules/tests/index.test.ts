import { describe, expect, test } from "vite-plus/test";
import type { ContextLike } from "noware-shared";
import { BaseModule } from "../src/index.ts";

describe("BaseModule", () => {
  class TestModule extends BaseModule {
    async load() {
      return;
    }
    async unload() {
      return;
    }
  }

  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as Record<string, unknown>;
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;

    const module = new TestModule(mockRequest, mockEnv, mockCtx);

    expect(module).toBeDefined();
    expect((module as unknown as { request: Request }).request).toBe(mockRequest);
  });

  test("load can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;

    const module = new TestModule(mockRequest, mockEnv, mockCtx);

    await expect(module.load()).resolves.toBeUndefined();
  });

  test("unload can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;

    const module = new TestModule(mockRequest, mockEnv, mockCtx);

    await expect(module.unload()).resolves.toBeUndefined();
  });

  test("static handlers map exists", () => {
    expect(BaseModule.handlers).toBeDefined();
  });
});
