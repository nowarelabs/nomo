import { z } from "zod";

export abstract class BaseValidator<T = unknown> {
  protected abstract schema: z.ZodType<T>;

  constructor(protected data: unknown) {}

  validate(): T {
    return this.schema.parse(this.data);
  }

  safeValidate() {
    return this.schema.safeParse(this.data);
  }

  static validate<V extends BaseValidator>(this: new (data: unknown) => V, data: unknown) {
    return new this(data).validate();
  }
}
