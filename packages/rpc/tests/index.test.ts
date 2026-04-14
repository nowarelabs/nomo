import { describe, expect, test } from "vite-plus/test";
import type { ContextLike } from "noware-shared";
import { BaseRpcServer } from "../src/index.ts";

describe("BaseRpcServer", () => {
  class TestRpcServer extends BaseRpcServer {
    async handle(_request: globalThis.Request) {
      return new Response("OK");
    }
  }

  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as Record<string, unknown>;
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;

    const server = new TestRpcServer(mockRequest, mockEnv, mockCtx);

    expect(server).toBeDefined();
    expect((server as unknown as { request: Request }).request).toBe(mockRequest);
    expect((server as unknown as { env: Record<string, unknown> }).env).toBe(mockEnv);
  });

  test("handle can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;

    const server = new TestRpcServer(mockRequest, mockEnv, mockCtx);

    const response = await server.handle(mockRequest);
    expect(response.status).toBe(200);
  });

  test("static handlers map exists", () => {
    expect(BaseRpcServer.handlers).toBeDefined();
  });
});
