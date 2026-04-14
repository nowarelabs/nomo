import { describe, expect, test, vi } from "vite-plus/test";
import { BaseView } from "../src/index.ts";

describe("BaseView", () => {
  class TestView extends BaseView {
    static render(data: unknown, assets?: unknown) {
      return `<div>${JSON.stringify(data)}</div>`;
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as any;
    
    const view = new TestView(mockRequest, mockEnv, mockCtx);
    
    expect(view).toBeDefined();
  });
  
  test("render can be overridden", () => {
    const result = TestView.render({ name: "test" });
    expect(result).toBe('<div>{"name":"test"}</div>');
  });
  
  test("static components exist", () => {
    expect(BaseView.components).toBeDefined();
  });
});