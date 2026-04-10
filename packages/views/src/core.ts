import { ComponentChild, FC } from "./types";

export type { ComponentChild, FC };

const isArray = Array.isArray;
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

function renderChild(c: ComponentChild): string {
  if (c == null || typeof c === "boolean") return "";
  if (isArray(c)) return c.map(renderChild).join("");
  return String(c);
}

export const Fragment = ({ children }: { children?: ComponentChild }): unknown => renderChild(children);

// --- DIRECT STRING JSX ---

function renderTag<P extends Record<string, unknown>>(tag: string, props: P | null): string {
  const p = (props || {}) as unknown;
  let h = `<${tag}`;
  let children = "";

  for (const k in p) {
    if (k === "children" || k === "key" || p[k] == null || p[k] === false) continue;
    if (k === "dangerouslySetInnerHTML") continue;

    const attr = k === "className" || k === "class" ? "class" : k === "htmlFor" ? "for" : k;
    let val = p[k];

    if (attr === "style" && typeof val === "object" && val !== null) {
      val =
        Object.entries(val)
          .map(([sk, sv]) => `${sk.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}:${sv}`)
          .join(";") + ";";
    }

    h += ` ${attr}="${val === true ? "" : esc(String(val))}"`;
  }

  const selfClosing = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
  ].includes(tag);

  if (selfClosing) return h + " />";

  h += ">";
  if (p.dangerouslySetInnerHTML?.__html) {
    children = p.dangerouslySetInnerHTML.__html;
  } else {
    children = renderChild(p.children);
  }

  return h + children + `</${tag}>`;
}

export function jsx<P extends Record<string, unknown>>(
  tag: string | FC<P> | (new (...args: unknown[]) => unknown),
  props: P | null,
  _key?: string | number,
): string {
  const p = (props || {}) as unknown;

  if (typeof tag === "function") {
    // If it's a class component (BaseView descendant)
    if (tag.prototype && tag.prototype.render && (tag as unknown).render) {
      const ctx = _ctx();
      return (tag as unknown).render(p, ctx?.a, ctx?.r);
    }
    return (tag as FC<unknown>)({ ...p, children: p.children });
  }

  return renderTag(tag as string, props);
}

export const jsxs = jsx;

export const h = (tag: unknown, props: unknown, ...children: unknown[]): string => {
  const p = props || {};
  if (children.length > 0) p.children = children.length === 1 ? children[0] : children;
  return jsx(tag, p);
};

export const text = (value: string): string => esc(value);

/**
 * Validates a CSS value string to prevent injection attacks.
 */
export function safeCss(value: string | undefined, fallback: string): string {
  if (!value) return fallback;
  if (/^#([A-Fa-f0-9]{3,6})$|^[a-z]+$|^rgba?\(.+\)$|^hsla?\(.+\)$/.test(value)) {
    return value;
  }
  return fallback;
}

/**
 * Tagged template literal for XSS-safe HTML strings.
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): string {
  const e = (s: unknown) =>
    String(s).replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
    );
  return strings.reduce((acc, str, i) => acc + str + (i < values.length ? e(values[i]) : ""), "");
}

// --- CONTEXT TRACKING ---

const getGlobal = () =>
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
      ? self
      : typeof window !== "undefined"
        ? window
        : ({} as unknown);
const _g = getGlobal();

export const withCtx = <T>(r: ContentRegistry, a: unknown, fn: () => T): T => {
  const prev = _g.__NB_VIEWS_CTX__;
  _g.__NB_VIEWS_CTX__ = { r, a };
  try {
    return fn();
  } finally {
    _g.__NB_VIEWS_CTX__ = prev;
  }
};

const _ctx = () => _g.__NB_VIEWS_CTX__;

// --- ARCHITECTURE HELPERS ---

export class ContentRegistry {
  private b = new Map<string, string[]>();
  push(n: string, c: string) {
    (this.b.get(n) || this.b.set(n, []).get(n)!).push(c);
  }
  yield(n: string) {
    return (this.b.get(n) || []).join("");
  }
}

export function content_for(n: string, c: ComponentChild) {
  const ctx = _ctx();
  if (ctx) ctx.r.push(n, renderChild(c));
  return "";
}
export function yield_content(n: string) {
  return _ctx()?.r.yield(n) || "";
}

/**
 * Renders a custom element tag for SSR.
 */
export function custom_element(
  tag: string,
  attrs: Record<string, unknown> = {},
  children: ComponentChild = null,
  options: { shadow?: boolean } = {},
): string {
  const innerContent = options.shadow
    ? jsx("template", { shadowrootmode: "open", children })
    : renderChild(children);

  return renderTag(tag, { ...attrs, dangerouslySetInnerHTML: { __html: innerContent } });
}

export abstract class AssetHelpers {
  constructor(
    protected r: ContentRegistry,
    protected a?: unknown,
  ) {}
  content_for(n: string, c: string) {
    this.r.push(n, c);
    return "";
  }
  yield_content(n: string) {
    return this.r.yield(n);
  }

  import_map_tag(customMap?: unknown) {
    const ctx = _ctx();
    const mapRaw = customMap
      ? JSON.stringify(customMap)
      : ctx?.a?.import_map_tag
        ? ctx.a.import_map_tag()
        : JSON.stringify({
            imports: {
              capnweb: "/assets/vendor/capnweb/index.js",
              "signal-polyfill": "/assets/vendor/signal-polyfill/index.js",
              "nomo/nofo": "/assets/vendor/nomo/nofo/index.js",
            },
          });
    return jsx("script", { type: "importmap", dangerouslySetInnerHTML: { __html: mapRaw } });
  }

  stylesheet_link_tag(n: string) {
    return jsx("link", { rel: "stylesheet", href: this.a?.path(n) || `/${n}` });
  }
  javascript_include_tag(n: string) {
    return jsx("script", { src: this.a?.path(n) || `/${n}`, type: "module" });
  }

  custom_element(
    tag: string,
    attrs: Record<string, unknown> = {},
    children: ComponentChild = null,
    options: { shadow?: boolean } = {},
  ) {
    return custom_element(tag, attrs, children, options);
  }
}

export abstract class BaseView<P = unknown> extends AssetHelpers {
  constructor(
    protected props: P,
    r: ContentRegistry,
    a?: unknown,
  ) {
    super(r, a);
  }
  abstract render(): string;
  static render<V extends typeof BaseView, P = unknown>(
    this: V,
    p: P,
    a?: unknown,
    r: ContentRegistry = new ContentRegistry(),
  ): string {
    return withCtx(r, a, () => {
      const instance = new (this as unknown)(p, r, a);
      return instance.render();
    });
  }
}

export abstract class BaseLayout<P = unknown> extends AssetHelpers {
  constructor(
    protected content: string,
    protected props: P,
    r: ContentRegistry,
    a?: unknown,
  ) {
    super(r, a);
  }
  abstract render(): string;
  static withLayout<L extends typeof BaseLayout, V extends typeof BaseView, P = unknown>(
    Layout: L,
    View: V,
    p: P,
    a?: unknown,
  ): string {
    const r = new ContentRegistry();
    const c = View.render(p, a, r);
    return withCtx(r, a, () => new (Layout as unknown)(c, p, r, a).render());
  }
}

export abstract class BaseDtoView<T = unknown> {
  constructor(protected data: T) {}

  abstract toDto(): unknown;

  protected filter(data: unknown, exclude: string[] = ["createdAt", "updatedAt"]): unknown {
    if (Array.isArray(data)) return data.map((v) => this.filter(v, exclude));
    if (data !== null && typeof data === "object") {
      return Object.fromEntries(Object.entries(data).filter(([k]) => !exclude.includes(k)));
    }
    return data;
  }

  json(): unknown {
    return this.toDto();
  }

  xml(): string {
    const data = this.toDto();
    const toXml = (obj: unknown, tag: string): string => {
      if (Array.isArray(obj)) return obj.map((v) => toXml(v, "item")).join("");
      if (obj !== null && typeof obj === "object") {
        const body = Object.entries(obj)
          .map(([k, v]) => toXml(v, k))
          .join("");
        return `<${tag}>${body}</${tag}>`;
      }
      return `<${tag}>${esc(String(obj))}</${tag}>`;
    };
    return `<?xml version="1.0" encoding="UTF-8"?>\n${toXml(data, "response")}`;
  }

  static renderJson<V extends typeof BaseDtoView>(this: V, data: unknown): unknown {
    return new (this as unknown)(data).json();
  }

  static renderXml<V extends typeof BaseDtoView>(this: V, data: unknown): string {
    return new (this as unknown)(data).xml();
  }
}

// Compatibility wrapper
export const render = (v: unknown): string => v;
export const renderToString = render;
