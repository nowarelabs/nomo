import { DurableObjectBaseDelegate } from "../delegate";

export interface CheckConfig {
  validator: (owner: unknown, data: unknown) => Promise<{ success: boolean; errors?: string[] }>;
}

export class CheckDelegate extends DurableObjectBaseDelegate<CheckConfig> {
  /**
   * Run the validation logic
   */
  async handle(data: unknown): Promise<{ success: boolean; errors?: string[] }> {
    const { validator } = this.config;
    try {
      return await validator(this.durableObject, data);
    } catch (e: unknown) {
      return { success: false, errors: [(e as Error).message] };
    }
  }
}
