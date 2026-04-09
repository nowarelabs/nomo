# Models

Database models with D1 and Durable Object support.

## Basic Model

```typescript
import { BaseModel } from 'nomo/models';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
});

export class UserModel extends BaseModel {
  table = users;

  async findByEmail(email: string) {
    return this.query().where({ email }).first();
  }
}
```

## Query Methods

```typescript
// Basic queries
const users = await model.query().all();
const user = await model.query().where({ id: '1' }).first();

// With conditions
const activeUsers = await model.query().where({ status: 'active' }).all();

// Ordering and pagination
const paginated = await model.query()
  .orderBy('createdAt', 'DESC')
  .limit(10)
  .offset(20)
  .all();

// Pluck single column
const emails = await model.query().pluck('email');
```

## CRUD Operations

```typescript
// Create
const user = await model.create({ name: 'John', email: 'john@example.com' });

// Read
const user = await model.findBy({ id: '1' });
const users = await model.all();

// Update
const updated = await model.update('1', { name: 'Jane' });

// Delete
await model.delete('1');
```

## Relationships

```typescript
// Define relationships
const relationships = {
  posts: { model: PostModel, foreignKey: 'userId' }
};

// Eager loading
const usersWithPosts = await model.findAllWith(
  { status: 'active' },
  relationships
);
```

## Soft Deletes

```typescript
// Trash (soft delete)
await model.trash('1');

// Restore
await model.restore('1');

// Purge (hard delete)
await model.purge('1');
```

## Model Options

| Option | Description |
|--------|-------------|
| `table` | Drizzle table definition |
| `dialect` | SQL dialect (sqlite, postgres, mysql) |