import { DurableObjectBaseDelegate } from "../delegate";

export interface LogicConfig {
  onCalculate?: (owner: unknown, input: unknown) => Promise<unknown>;
  onTrigger?: (owner: unknown, event: unknown) => Promise<void>;
  onDecision?: (owner: unknown, matrix: unknown) => Promise<unknown>;
}

export class LogicDelegate extends DurableObjectBaseDelegate<LogicConfig> {
  /**
   * Perform calculation logic
   */
  async handle(input: unknown): Promise<unknown> {
    const { onCalculate } = this.config;
    if (onCalculate) {
      return await onCalculate(this.durableObject, input);
    }
    return input;
  }

  /**
   * Handle triggers from external events
   */
  async trigger(event: unknown): Promise<void> {
    const { onTrigger } = this.config;
    if (onTrigger) {
      await onTrigger(this.durableObject, event);
    }
  }

  /**
   * Evaluate a decision matrix
   */
  async decide(matrix: unknown): Promise<unknown> {
    const { onDecision } = this.config;
    if (onDecision) {
      return await onDecision(this.durableObject, matrix);
    }
    return matrix;
  }
}
