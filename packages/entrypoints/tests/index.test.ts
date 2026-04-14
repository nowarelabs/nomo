import { describe, expect, test, vi } from "vite-plus/test";
import { BaseWorker } from "../src/index.ts";

describe("BaseWorker", () => {
  class TestWorker extends BaseWorker {
    async fetch(request: globalThis.Request, env: Record<string, unknown>, ctx: any) {
      return new Response("OK");
    }
  }
  
  test("fetch must be implemented", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as any;
    
    const worker = new TestWorker();
    
    const response = await worker.fetch(mockRequest, mockEnv, mockCtx);
    expect(response.status).toBe(200);
  });
});