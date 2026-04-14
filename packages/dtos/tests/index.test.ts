import { describe, expect, test, vi } from "vite-plus/test";
import { Dto } from "../src/index.ts";

describe("Dto", () => {
  test("constructor accepts optional params", () => {
    const dto = new Dto();
    expect(dto).toBeDefined();
  });
  
  test("toJSON returns empty object by default", () => {
    const dto = new Dto();
    expect(dto.toJSON()).toEqual({});
  });
  
  test("fromJSON creates Dto instance", () => {
    const dto = Dto.fromJSON({ name: "test" });
    expect(dto).toBeDefined();
  });
});