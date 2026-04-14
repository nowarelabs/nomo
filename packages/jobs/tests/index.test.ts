import { describe, expect, test, vi } from "vite-plus/test";
import { JobDispatcher } from "../src/index.ts";

describe("JobDispatcher", () => {
  class TestDispatcher extends JobDispatcher {
    async dispatch(jobName: string, payload: unknown) {
      return;
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { QUEUE: {} } as unknown;
    const mockCtx = {} as any;
    
    const dispatcher = new TestDispatcher(mockRequest, mockEnv, mockCtx);
    
    expect(dispatcher).toBeDefined();
  });
  
  test("dispatch can be overridden", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const dispatcher = new TestDispatcher(mockRequest, mockEnv, mockCtx);
    
    await expect(dispatcher.dispatch("test-job", { data: "test" })).resolves.toBeUndefined();
  });
  
  test("static jobs map exists", () => {
    expect(JobDispatcher.jobs).toBeDefined();
  });
});