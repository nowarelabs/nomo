import { describe, expect, test } from "vite-plus/test";
import { Dto } from "../src/index.ts";

describe("Dto", () => {
  class TestDto extends Dto {}

  test("constructor accepts optional params", () => {
    const dto = new TestDto();
    expect(dto).toBeDefined();
  });

  test("toJSON returns empty object by default", () => {
    const dto = new TestDto();
    expect(dto.toJSON()).toEqual({});
  });

  test("fromJSON creates Dto instance", () => {
    const dto = TestDto.fromJSON({ name: "test" });
    expect(dto).toBeDefined();
  });
});
