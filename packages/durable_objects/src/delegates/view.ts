import { DurableObjectBaseDelegate } from "../delegate";

export interface ViewConfig {
  table: string | { name: string };
  primaryKey?: string;
}

export class ViewDelegate extends DurableObjectBaseDelegate<ViewConfig> {
  async handle(
    options: {
      where?: Record<string, unknown>;
      limit?: number;
      offset?: number;
    } = {},
  ): Promise<unknown[]> {
    const { table } = this.config;
    const tableName = typeof table === "string" ? table : table.name;

    let sql = `SELECT * FROM ${tableName}`;
    const params: unknown[] = [];

    if (options.where && Object.keys(options.where).length > 0) {
      const conditions = Object.entries(options.where).map(([key, value]) => {
        params.push(value);
        return `${key} = $${params.length}`;
      });
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    if (options.limit) {
      params.push(options.limit);
      sql += ` LIMIT $${params.length}`;
    }

    if (options.offset) {
      params.push(options.offset);
      sql += ` OFFSET $${params.length}`;
    }

    const result = await this.durableObject.storage.sql.exec(sql, params);
    return result.toArray();
  }

  async find(id: unknown): Promise<unknown | null> {
    const { table, primaryKey = "id" } = this.config;
    const tableName = typeof table === "string" ? table : table.name;

    const result = await this.durableObject.storage.sql
      .exec(`SELECT * FROM ${tableName} WHERE ${primaryKey} = ? LIMIT 1`, [id])
      .toArray();

    return result[0] || null;
  }
}
