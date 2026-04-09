export abstract class BaseNormalizer<T = any> {
  constructor(protected data: T) {}

  abstract normalize(): T;

  static normalize<N extends BaseNormalizer>(this: new (data: any) => N, data: any) {
    return new this(data).normalize();
  }
}
