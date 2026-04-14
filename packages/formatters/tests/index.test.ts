import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { Formatter, BaseFormatter } from "../src/index.ts";

describe("Formatter", () => {
  test("Formatter interface requires format method", () => {
    const formatter: Formatter<string> = {
      format: (data: unknown) => "formatted",
    };
    
    expect(formatter.format).toBeDefined();
  });
});

describe("BaseFormatter", () => {
  class TestFormatter extends BaseFormatter {
    format(data: unknown) {
      return { ...data as object, formatted: true };
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const formatter = new TestFormatter(mockRequest, mockEnv, mockCtx);
    
    expect(formatter).toBeDefined();
  });
  
  test("format can be overridden", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const formatter = new TestFormatter(mockRequest, mockEnv, mockCtx);
    const result = formatter.format({ name: "test" });
    expect(result).toEqual({ name: "test", formatted: true });
  });
});