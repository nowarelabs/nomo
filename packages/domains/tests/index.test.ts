import { describe, expect, test, vi } from "vite-plus/test";
import { Entity, ValueObject, EntityFactory } from "../src/index.ts";

describe("Entity", () => {
  test("Entity type requires id", () => {
    const entity: Entity<{ name: string }> = {
      id: "entity-1",
      name: "Test",
    };
    
    expect(entity.id).toBe("entity-1");
    expect(entity.name).toBe("Test");
  });
});

describe("ValueObject", () => {
  test("ValueObject is just the type", () => {
    const vo: ValueObject<{ amount: number }> = { amount: 100 };
    expect(vo.amount).toBe(100);
  });
});

describe("EntityFactory", () => {
  test("constructor accepts optional params", () => {
    const factory = new EntityFactory();
    expect(factory).toBeDefined();
  });
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = {} as any;
    
    const factory = new EntityFactory(mockRequest, mockEnv, mockCtx);
    expect(factory).toBeDefined();
  });
});