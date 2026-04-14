import { describe, expect, test, vi } from "vite-plus/test";
import { Validator, BaseValidator } from "../src/index.ts";

describe("Validator", () => {
  test("Validator interface requires validate method", () => {
    const validator: Validator<string> = {
      validate: (data: unknown) => "validated",
    };
    
    expect(validator.validate).toBeDefined();
  });
});

describe("BaseValidator", () => {
  class TestValidator extends BaseValidator {
    validate(data: unknown) {
      return { ...data as object, validated: true };
    }
  }
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const validator = new TestValidator(mockRequest, mockEnv, mockCtx);
    
    expect(validator).toBeDefined();
  });
  
  test("validate can be overridden", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as any;
    
    const validator = new TestValidator(mockRequest, mockEnv, mockCtx);
    const result = validator.validate({ name: "test" });
    expect(result).toEqual({ name: "test", validated: true });
  });
});