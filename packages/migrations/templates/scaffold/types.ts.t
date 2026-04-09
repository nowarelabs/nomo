import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { {{tableName}} } from '../../db/schema/schema';

export const Create{{typeName}}Schema = createInsertSchema({{tableName}});
export const Select{{typeName}}Schema = createSelectSchema({{tableName}});
export const Update{{typeName}}Schema = Create{{typeName}}Schema.partial();

export type {{typeName}} = z.infer<typeof Select{{typeName}}Schema>;
export type New{{typeName}} = z.infer<typeof Create{{typeName}}Schema>;
export type Update{{typeName}}Payload = z.infer<typeof Update{{typeName}}Schema>;
export type Patch{{typeName}}Payload = z.infer<typeof Update{{typeName}}Schema>;

export type CreateMany{{typeName}}Payload = New{{typeName}}[];

export type {{typeName}}Filter = {
  column: keyof {{typeName}};
  value: any;
};

export type {{typeName}}Where = Partial<{{typeName}}>;

export type {{typeName}}Key = keyof {{typeName}};
export type {{typeName}}KeyValue = { key: {{typeName}}Key; value: any };
export type Get{{typeName}}ByKeyAndValue = {{typeName}}KeyValue;
export type Update{{typeName}}ByKeyAndValue = {{typeName}}KeyValue & { data: Update{{typeName}}Payload };
export type Patch{{typeName}}ByKeyAndValue = {{typeName}}KeyValue & { data: Patch{{typeName}}Payload };
export type Delete{{typeName}}ByKeyAndValue = {{typeName}}KeyValue;
export type Exists{{typeName}}ByKeyAndValue = {{typeName}}KeyValue;
export type Count{{typeName}}ByKeyAndValue = {{typeName}}KeyValue;
export type Upsert{{typeName}}ByKeyAndValue = {{typeName}}KeyValue & { data: New{{typeName}} };