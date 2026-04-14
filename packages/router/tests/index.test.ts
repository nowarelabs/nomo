import { describe, expect, test } from "vite-plus/test";
import type { ContextLike } from "noware-shared";
import { BaseRouter } from "../src/index.ts";

describe("BaseRouter", () => {
  class TestRouter extends BaseRouter {
    async handle(_request: globalThis.Request) {
      return new Response("OK");
    }
  }

  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as Record<string, unknown>;
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;

    const router = new TestRouter(mockRequest, mockEnv, mockCtx);

    expect(router).toBeDefined();
    expect((router as unknown as { request: Request }).request).toBe(mockRequest);
    expect((router as unknown as { env: Record<string, unknown> }).env).toBe(mockEnv);
  });

  test("handle can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;

    const router = new TestRouter(mockRequest, mockEnv, mockCtx);

    const response = await router.handle(mockRequest);
    expect(response.status).toBe(200);
  });

  test("static routes array exists", () => {
    expect(BaseRouter.routes).toBeDefined();
  });
});
