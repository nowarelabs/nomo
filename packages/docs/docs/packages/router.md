# Router

Trie-based router for Nomo applications with OpenAPI support.

## Installation

```bash
pnpm add nomo/router
```

## Basic Usage

```typescript
import { Router, get, post, put, del } from 'nomo/router';

const router = new Router();

router.get('/', (req, env, ctx) => {
  return new Response('Hello World');
});

router.get('/users/:id', (req, env, ctx) => {
  return ctx.json({ userId: ctx.params.id });
});

router.post('/users', async (req, env, ctx) => {
  const body = await ctx.parseJson();
  return ctx.json(body, { status: 201 });
});
```

## Route Methods

```typescript
router.get(path, handler)    // GET
router.post(path, handler)   // POST
router.put(path, handler)    // PUT
router.patch(path, handler) // PATCH
router.delete(path, handler) // DELETE
router.head(path, handler)  // HEAD
router.options(path, handler) // OPTIONS
```

## Path Parameters

```typescript
// URL parameters
router.get('/users/:id/posts/:postId', (req, env, ctx) => {
  const { id, postId } = ctx.params;
  return ctx.json({ userId: id, postId });
});

// Query parameters
router.get('/search', (req, env, ctx) => {
  const { q, page } = ctx.query;
  return ctx.json({ query: q, page });
});

// Nested params (user[title])
router.post('/users', (req, env, ctx) => {
  const { user } = ctx.params; // { name: '...', email: '...' }
  return ctx.json(user);
});
```

## Middleware

```typescript
const router = new Router({
  middleware: [
    async (req, env, ctx, next) => {
      // Before request
      const response = await next();
      // After request
      return response;
    }
  ]
});
```

## OpenAPI Integration

```typescript
import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

const registry = new OpenAPIRegistry();
registry.registerPath({
  method: 'get',
  path: '/users/{id}',
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: 'User found', content: { 'application/json': { schema: z.object({ id: z.string(), name: z.string() }) } } },
    404: { description: 'User not found' }
  }
});

const generator = new OpenApiGeneratorV3(registry.definitions);
const openApiDoc = generator.generateDocument({ openapi: '3.0.0', info: { title: 'My API', version: '1.0.0' } });
```

## Router Options

```typescript
const router = new Router({
  basePath: '/api/v1',      // Base path for all routes
  prefix: 'api',            // URL prefix
  onNotFound: (req, env, ctx) => {
    return new Response('Not Found', { status: 404 });
  },
  onError: (err, req, env, ctx) => {
    return new Response(err.message, { status: 500 });
  }
});
```

## Context Methods

| Method | Description |
|--------|-------------|
| `ctx.parseJson()` | Parse request body as JSON |
| `ctx.json(data, init)` | Send JSON response |
| `ctx.text(data, init)` | Send text response |
| `ctx.html(data, init)` | Send HTML response |
| `ctx.redirect(url, status)` | Redirect to URL |