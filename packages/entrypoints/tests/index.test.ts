import { describe, expect, test } from "vite-plus/test";
import { BaseWorker } from "../src/index.ts";

describe("BaseWorker", () => {
  class TestWorker extends BaseWorker {
    async fetch(_request: globalThis.Request, _env: Record<string, unknown>, _ctx: any) {
      return new Response("OK");
    }
  }

  test("fetch must be implemented", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as Record<string, unknown>;
    const mockCtx = {} as any;

    const worker = new TestWorker();

    const response = await worker.fetch(mockRequest, mockEnv, mockCtx);
    expect(response.status).toBe(200);
  });
});
