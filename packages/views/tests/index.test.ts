import { describe, expect, test } from "vite-plus/test";
import type { ContextLike } from "noware-shared";
import { BaseView } from "../src/index.ts";

describe("BaseView", () => {
  class TestView extends BaseView {
    static render(data: unknown, _assets?: unknown) {
      return `<div>${JSON.stringify(data)}</div>`;
    }
  }

  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;

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
