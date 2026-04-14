import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { BaseWorker } from "../src/index.ts";

describe("BaseWorker", () => {
  class TestWorker extends BaseWorker {
    async fetch(request: Request, env: Record<string, unknown>, ctx: ExecutionContext) {
      return new Response("OK");
    }
  }
  
  test("fetch must be implemented", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const worker = new TestWorker();
    
    const response = await worker.fetch(mockRequest, mockEnv, mockCtx);
    expect(response.status).toBe(200);
  });
});