import { describe, expect, test, vi } from "vite-plus/test";
import type { Request, ExecutionContext } from "@cloudflare/workers-types";
import { Plugin, PluginRegistry } from "../src/index.ts";

describe("Plugin", () => {
  test("Plugin interface requires name and install", () => {
    const plugin: Plugin = {
      name: "test-plugin",
      install: () => {},
    };
    
    expect(plugin.name).toBe("test-plugin");
    expect(plugin.install).toBeDefined();
  });
});

describe("PluginRegistry", () => {
  beforeEach(() => {
    PluginRegistry.plugins = [];
  });
  
  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as unknown;
    const mockCtx = {} as ExecutionContext;
    
    const registry = new PluginRegistry(mockRequest, mockEnv, mockCtx);
    
    expect(registry).toBeDefined();
  });
  
  test("static register adds plugin", () => {
    const plugin: Plugin = {
      name: "test-plugin",
      install: () => {},
    };
    
    PluginRegistry.register(plugin);
    
    expect(PluginRegistry.plugins).toHaveLength(1);
    expect(PluginRegistry.plugins[0].name).toBe("test-plugin");
  });
  
  test("register calls install", () => {
    const installFn = vi.fn();
    const plugin: Plugin = {
      name: "test-plugin",
      install: installFn,
    };
    
    PluginRegistry.register(plugin);
    
    expect(installFn).toHaveBeenCalled();
  });
});