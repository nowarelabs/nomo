# Entrypoints

HTTP entry point utilities for Nomo applications.

## createEntrypoint

```typescript
import { createEntrypoint, createRouter } from 'nomo/entrypoints';
import { get, controllerAction } from 'nomo/controllers';
import { HomeController } from './controllers/home';

const router = createRouter();

// Register controller actions
router.get('/', controllerAction(HomeController, 'index'));
router.get('/users', controllerAction(HomeController, 'list'));

const entrypoint = createEntrypoint({
  router,
  options: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      headers: ['Content-Type', 'Authorization']
    }
  }
});

export default entrypoint;
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `router` | `Router` | The router instance |
| `options.cors` | `CorsOptions` | CORS configuration |
| `options.requestIdHeader` | `string` | Custom request ID header |

## CORS Configuration

```typescript
const entrypoint = createEntrypoint({
  router,
  options: {
    cors: {
      origin: ['https://example.com', 'https://app.example.com'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      headers: ['Content-Type', 'Authorization', 'X-Request-ID'],
      exposeHeaders: ['X-Custom-Header'],
      credentials: true,
      maxAge: 86400
    }
  }
});
```