import { describe, expect, test } from "vite-plus/test";
import { BaseContext } from "../src/index.ts";

describe("BaseContext", () => {
  class TestContext extends BaseContext {
    async loadModule(name: string, module: unknown) {
      super.loadModule(name, module);
    }
  }

  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = { DB: {} } as Record<string, unknown>;
    const mockCtx = {} as any;

    const context = new TestContext(mockRequest, mockEnv, mockCtx);

    expect(context).toBeDefined();
  });

  test("loadModule adds module to map", async () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as any;

    const context = new TestContext(mockRequest, mockEnv, mockCtx);
    await context.loadModule("test-module", {});

    expect(context.modules.get("test-module")).toEqual({});
  });

  test("static modules map exists", () => {
    expect(BaseContext.modules).toBeDefined();
  });
});
