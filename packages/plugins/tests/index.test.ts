import { describe, expect, test, vi, beforeEach } from "vite-plus/test";
import type { ContextLike } from "noware-shared";
import { Plugin, PluginRegistry } from "../src/index.ts";

describe("Plugin", () => {
  test("Plugin interface requires name and install", () => {
    const plugin: Plugin = {
      name: "test-plugin",
      install: () => {},
    };

    expect(plugin.name).toBe("test-plugin");
    const installFn = plugin.install;
    expect(installFn).toBeDefined();
  });
});

describe("PluginRegistry", () => {
  beforeEach(() => {
    PluginRegistry.plugins = [];
  });

  test("constructor accepts request, env, ctx", () => {
    const mockRequest = new Request("http://localhost");
    const mockEnv = {} as Record<string, unknown>;
    const mockCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as ContextLike;

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
