import { ComponentChild } from "./types";

export declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: unknown;
  }
  interface ElementClass {
    render(): ComponentChild;
  }
  interface ElementAttributesProperty {
    props: {};
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * Support for standard and custom elements (Web Components).
       * Custom elements are normally kebab-case.
       */
      [elemName: string]: unknown;
    }
    type Element = unknown;
    interface ElementClass {
      render(): ComponentChild;
    }
    interface ElementAttributesProperty {
      props: {};
    }
  }
}
