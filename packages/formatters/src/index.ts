export abstract class BaseFormatter<T = unknown, R = unknown> {
  constructor(protected data: T) {}

  abstract format(): R;

  static format<F extends BaseFormatter>(this: new (data: unknown) => F, data: unknown) {
    return new this(data).format();
  }
}
