import { DurableObjectBaseDelegate } from "../delegate";

export interface ConfigEntry<T = unknown> {
  key: string;
  value: T;
}

export interface ConfigOptions {
  onConfigure?: (owner: unknown, config: unknown) => Promise<void>;
  onAdapter?: (owner: unknown, input: unknown) => Promise<unknown>;
  onFurnish?: (owner: unknown, output: unknown) => Promise<unknown>;
}

export class ConfigDelegate extends DurableObjectBaseDelegate<ConfigOptions> {
  /**
   * Configure the Durable Object with settings.
   */
  async handle(settings: unknown): Promise<void> {
    const { onConfigure } = this.config;
    if (onConfigure) {
      await onConfigure(this.durableObject, settings);
    }
  }

  /**
   * Adapt data from one form to another.
   */
  async adapt(input: unknown): Promise<unknown> {
    const { onAdapter } = this.config;
    if (onAdapter) {
      return await onAdapter(this.durableObject, input);
    }
    return input;
  }

  /**
   * Furnish the output data.
   */
  async furnish(output: unknown): Promise<unknown> {
    const { onFurnish } = this.config;
    if (onFurnish) {
      return await onFurnish(this.durableObject, output);
    }
    return output;
  }
}
