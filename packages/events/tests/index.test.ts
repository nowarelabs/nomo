import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { EventEmitter } from "../src/index.ts";

describe("EventEmitter", () => {
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as ExecutionContext;
    
    const emitter = new EventEmitter(mockRequest, mockEnv, mockCtx);
    
    expect(emitter).toBeDefined();
    expect(emitter.request).toBe(mockRequest);
  });
  
  test("on method exists", () => {
    const emitter = new EventEmitter(new Request("http://localhost"), {}, {});
    expect(typeof emitter.on).toBe("function");
  });
  
  test("emit method exists", () => {
    const emitter = new EventEmitter(new Request("http://localhost"), {}, {});
    expect(typeof emitter.emit).toBe("function");
  });
  
  test("on registers handler", () => {
    const emitter = new EventEmitter(new Request("http://localhost"), {}, {});
    const handler = vi.fn();
    emitter.on("test-event", handler);
  });
  
  test("emit calls handler", () => {
    const emitter = new EventEmitter(new Request("http://localhost"), {}, {});
    const handler = vi.fn();
    emitter.on("test-event", handler);
    emitter.emit("test-event", { data: "test" });
  });
});