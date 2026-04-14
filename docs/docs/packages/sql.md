# SQL

SQL query builder with multi-dialect support.

## Basic Usage

```typescript
import { sql, select, insert, update, del } from "noware/sql";

// Select
const query = sql.select("users").where({ status: "active" }).limit(10);

// Insert
const result = await sql.insert("users", { name: "John", email: "john@example.com" });

// Update
await sql.update("users", { name: "Jane" }).where({ id: "1" });

// Delete
await sql.delete("users").where({ id: "1" });
```

## Query Builder

```typescript
import { query } from "noware/sql";

const results = await query
  .from("users")
  .select("id", "name", "email")
  .where({ status: "active" })
  .orderBy("createdAt", "DESC")
  .limit(20)
  .offset(0)
  .execute();
```

## Dialects

Supported dialects: `sqlite`, `postgres`, `mysql`

```typescript
const q = new FluentQuery(db, table, logger, "sqlite");
```

## Operators

```typescript
.where({ status: 'active' })           // equality
.where({ age: { gt: 18 } })           // greater than
.where({ age: { gte: 18 } })          // greater or equal
.where({ age: { lt: 65 }) })          // less than
.where({ age: { lte: 65 } })          // less or equal
.where({ name: { like: '%john%' } })  // LIKE
.where({ id: { in: ['1', '2', '3'] }) // IN
.where({ id: { nin: ['4', '5'] } })   // NOT IN
```
