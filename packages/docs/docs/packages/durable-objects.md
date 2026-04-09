# Durable Objects

Utilities for working with Cloudflare Durable Objects.

## Basic Usage

```typescript
import { DurableObject } from 'nomo/durable-objects';

export class ChatRoom extends DurableObject {
  async onMessage(message: string) {
    const state = await this.storage.get('messages') || [];
    state.push(message);
    await this.storage.put('messages', state);
  }

  async onConnect(request: Request): Promise<Response> {
    return new Response('WebSocket connection established');
  }
}
```

## Storage Methods

```typescript
// Get value
const value = await this.storage.get('key');

// Set value
await this.storage.put('key', 'value');

// Delete value
await this.storage.delete('key');

// List keys
const keys = await this.storage.list();

// Transactions
await this.storage.transaction(async (tx) => {
  const count = await tx.get('count') || 0;
  await tx.put('count', count + 1);
});
```

## Alarms

```typescript
// Set alarm (runs after specified delay)
await this.storage.setAlarm(Date.now() + 60000); // 1 minute

// Handle alarm
async alarm() {
  // Do something
}
```

## Options

| Method | Description |
|--------|-------------|
| `onMessage(msg)` | Handle incoming message |
| `onConnect(req)` | Handle WebSocket connect |
| `alarm()` | Handle scheduled alarm |