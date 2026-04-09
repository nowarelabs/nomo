export abstract class BaseDomain {
  constructor(
    protected env: any,
    protected ctx: any,
  ) {}

  async perform<R>(callback: () => Promise<R>): Promise<R> {
    await this.beforePerform();
    try {
      const result = await callback();
      await this.afterPerform();
      return result;
    } catch (error) {
      await this.onPerformError(error);
      throw error;
    }
  }

  protected async beforePerform(): Promise<void> {}
  protected async afterPerform(): Promise<void> {}
  protected async onPerformError(error: any): Promise<void> {}
}
