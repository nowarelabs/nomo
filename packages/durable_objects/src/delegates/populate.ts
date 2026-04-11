import { DurableObjectBaseDelegate } from "../delegate";
import { BaseDurableObject } from "../index";

export interface PopulateConfig {
  from: (owner: BaseDurableObject, ...args: unknown[]) => Promise<Record<string, unknown>[]>;
  into: string | { name: string };
  onBeforePopulate?: (owner: BaseDurableObject) => Promise<void>;
  onAfterPopulate?: (owner: BaseDurableObject, count: number) => Promise<void>;
}

export class PopulateDelegate extends DurableObjectBaseDelegate<PopulateConfig> {
  async handle(...args: unknown[]): Promise<{ status: string; count: number }> {
    const { from, into, onBeforePopulate, onAfterPopulate } = this.config;

    if (onBeforePopulate) {
      await onBeforePopulate(this.durableObject);
    }

    await this.durableObject.clear(into);

    const records = (await from(this.durableObject, ...args)) as Record<string, unknown>[];

    let count = 0;
    if (records && records.length > 0) {
      count = await this.durableObject.insertBatch(into, records);
    }

    if (onAfterPopulate) {
      await onAfterPopulate(this.durableObject, count);
    }

    return { status: "populated", count };
  }
}
