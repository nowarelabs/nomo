# RPC

RPC over HTTP for Nomo applications.

## Basic Usage

```typescript
import { createRpcRouter } from 'nomo/rpc';

const rpc = createRpcRouter({
  methods: {
    user: {
      async getUser(id: string) {
        return { id, name: 'John' };
      },
      async createUser(data: { name: string; email: string }) {
        return { id: '1', ...data };
      }
    }
  }
});

export default rpc;
```

## Client

```typescript
import { createRpcClient } from 'nomo/rpc';

const client = createRpcClient({
  baseUrl: 'https://my-worker.workers.dev/rpc'
});

// Call methods
const user = await client.user.getUser('1');
const newUser = await client.user.createUser({ name: 'Jane', email: 'jane@example.com' });
```

## Options

| Option | Type | Description |
|--------|------|-------------|
| `methods` | `Record<string, object>` | RPC method definitions |
| `baseUrl` | `string` | Server base URL (client) |