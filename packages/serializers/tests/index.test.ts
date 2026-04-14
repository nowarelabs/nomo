import { describe, expect, test } from "vite-plus/test";
import { Serializer } from "../src/index.ts";

describe("Serializer", () => {
  class TestSerializer extends Serializer {}

  test("constructor accepts optional params", () => {
    const serializer = new TestSerializer();
    expect(serializer).toBeDefined();
  });

  test("serialize converts object to string", () => {
    const serializer = new TestSerializer();
    const result = serializer.serialize({ name: "test" });
    expect(result).toBe('{"name":"test"}');
  });

  test("deserialize converts string to object", () => {
    const serializer = new TestSerializer();
    const result = serializer.deserialize('{"name":"test"}');
    expect(result).toEqual({ name: "test" });
  });
});
