# Migrations

Database migration utilities for Noware applications.

## Basic Usage

```typescript
import { MigrationRunner } from "noware/migrations";

const runner = new MigrationRunner({
  db: env.DB,
  tableName: "_migrations",
});

// Run pending migrations
await runner.migrate();

// Get migration status
const status = await runner.status();
```

## Creating Migrations

```typescript
// migrations/001_create_users.ts
export const up = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )
`;

export const down = `
  DROP TABLE IF EXISTS users
`;
```

## Options

| Option      | Type         | Description               |
| ----------- | ------------ | ------------------------- |
| `db`        | `D1Database` | D1 database instance      |
| `tableName` | `string`     | Migrations table name     |
| `directory` | `string`     | Migration files directory |

## Durable Object Migration

```typescript
import { DurableMigrationRunner } from "noware/migrations";

export class MigrationDO extends DurableObject {
  async onMessage(message: MigrationMessage) {
    const runner = new DurableMigrationRunner(this.storage);
    await runner.migrate(message.migrations);
  }
}
```
