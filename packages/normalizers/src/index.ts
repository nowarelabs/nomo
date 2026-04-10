export abstract class BaseNormalizer<T = unknown> {
  constructor(protected data: T) {}

  abstract normalize(): T;

  static normalize<N extends BaseNormalizer>(this: new (data: unknown) => N, data: unknown) {
    return new this(data).normalize();
  }
}
