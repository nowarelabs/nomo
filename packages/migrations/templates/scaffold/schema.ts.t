import { sqliteTable, text, integer, real, blob, foreignKey, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const {{tableName}} = sqliteTable('{{tableName}}', {
  id: text('id').primaryKey(),
{{columns}}
  created_at: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});