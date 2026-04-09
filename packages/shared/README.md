# @noblackbox/shared

A collection of common middlewares and utilities used throughout the Noblackbox ecosystem. This package ensures that standard concerns like CORS and logging are handled consistently across all your Workers.

## Installation

```bash
pnpm add @noblackbox/shared
```

---

## 1. Middlewares

### 1.1. `corsMiddleware`

Standard CORS implementation for Cloudflare Workers.

```typescript
import { corsMiddleware } from "@noblackbox/shared";
import { Router } from "@noblackbox/router";

const router = new Router();
router.use(
  corsMiddleware({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
```

### 1.2. `loggerMiddleware`

Provides request logging for visibility and debugging.

```typescript
import { loggerMiddleware } from "@noblackbox/shared";

router.use(loggerMiddleware());
```

---

## 2. Utility Collections

While primary logic resides in specialized packages, `@noblackbox/shared` provides small, cross-cutting helpers that don't warrant their own package.

- **String Helpers**: Trimming, capitalization, and case conversion.
- **Object Utilities**: Deep merge, picking, and omitting keys.
- **Cloudflare Helpers**: Metadata extraction from `request.cf`.

---

## 3. Contributing

When adding to `@noblackbox/shared`, ensure that the utility is truly general-purpose and used by at least two other packages or applications in the workspace.

---

## License

MIT
