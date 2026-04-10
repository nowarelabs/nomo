# Getting Started

Learn how to set up and use the Nomo framework.

## Installation

Choose your preferred package manager:

::: code-group

```bash [npm]
npm create nomo@latest
cd nomo
npm install
npm run dev
```

```bash [pnpm]
pnpm create nomo@latest
cd nomo
pnpm install
pnpm dev
```

```bash [yarn]
yarn create nomo@latest
cd nomo
yarn install
yarn dev
```

```bash [bun]
bun create nomo@latest
cd nomo
bun install
bun dev
```

```bash [deno]
deno run -A npm:create-nomo@latest
cd nomo
deno install
deno task dev
```

:::

## Quick Start

1. **Create a new controller:**

```typescript
// src/controllers/home.ts
import { BaseController, get } from 'nomo/controllers';

export class HomeController extends BaseController {
  protected service = null;

  @get('/')
  index() {
    return this.json({ message: 'Hello from Nomo!' });
  }
}
```

2. **Set up your router:**

```typescript
// src/index.ts
import { createRouter, createEntrypoint } from 'nomo/entrypoints';
import { controllerAction } from 'nomo/controllers';
import { HomeController } from './controllers/home';

const router = createRouter();

router.get('/', controllerAction(HomeController, 'index'));

export default createEntrypoint({ router });
```

3. **Run locally:**

```bash
pnpm dev
```

Visit `http://localhost:8787` to see your app.

## Project Structure

```
nomo-app/
├── src/
│   ├── controllers/     # Request handlers
│   ├── services/       # Business logic
│   ├── models/         # Database models
│   ├── views/          # UI components
│   └── index.ts        # Entry point
├── wrangler.jsonc      # Cloudflare config
├── package.json
└── tsconfig.json
```

## Next Steps

- [Architecture](/packages/architecture) - Learn how Nomo works
- [Controllers](/packages/controllers) - Deep dive into controllers
- [Examples](/packages/examples) - Practical code examples