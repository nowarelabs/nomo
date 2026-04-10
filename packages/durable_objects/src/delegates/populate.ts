import { DurableObjectBaseDelegate } from "../delegate";
import { BaseDurableObject } from "../index";

export interface PopulateConfig<T = unknown> {
  from: (owner: BaseDurableObject, ...args: unknown[]) => Promise<T[]>;
  into: unknown; // Drizzle table or table name
  onBeforePopulate?: (owner: BaseDurableObject) => Promise<void>;
  onAfterPopulate?: (owner: BaseDurableObject, count: number) => Promise<void>;
}

export class PopulateDelegate extends DurableObjectBaseDelegate<PopulateConfig> {
  async handle(...args: unknown[]): Promise<{ status: string; count: number }> {
    const { from, into, onBeforePopulate, onAfterPopulate } = this.config;

    if (onBeforePopulate) {
      await onBeforePopulate(this.durableObject);
    }

    // Default: clear the table before populating
    await this.durableObject.clear(into);

    const records = await from(this.durableObject, ...args);

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
