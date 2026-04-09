export abstract class BaseFormatter<T = any, R = any> {
  constructor(protected data: T) {}

  abstract format(): R;

  static format<F extends BaseFormatter>(this: new (data: any) => F, data: any) {
    return new this(data).format();
  }
}
