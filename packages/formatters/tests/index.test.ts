import { describe, expect, test } from "vite-plus/test";
import { Formatter, BaseFormatter } from "../src/index.ts";

describe("Formatter", () => {
  test("Formatter interface requires format method", () => {
    const formatter: Formatter<string> = {
      format: (_data: unknown) => "formatted",
    };

    expect(formatter.format).toBeDefined();
  });
});

describe("BaseFormatter", () => {
  class TestFormatter extends BaseFormatter {
    format(data: unknown) {
      return { ...(data as object), formatted: true };
    }
  }

  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as any;

    const formatter = new TestFormatter(mockRequest, mockEnv, mockCtx);

    expect(formatter).toBeDefined();
  });

  test("format can be overridden", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as any;

    const formatter = new TestFormatter(mockRequest, mockEnv, mockCtx);
    const result = formatter.format({ name: "test" });
    expect(result).toEqual({ name: "test", formatted: true });
  });
});
