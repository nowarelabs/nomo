import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { Serializer } from "../src/index.ts";

describe("Serializer", () => {
  test("constructor accepts optional params", () => {
    const serializer = new Serializer();
    expect(serializer).toBeDefined();
  });
  
  test("serialize converts object to string", () => {
    const serializer = new Serializer();
    const result = serializer.serialize({ name: "test" });
    expect(result).toBe('{"name":"test"}');
  });
  
  test("deserialize converts string to object", () => {
    const serializer = new Serializer();
    const result = serializer.deserialize('{"name":"test"}');
    expect(result).toEqual({ name: "test" });
  });
});