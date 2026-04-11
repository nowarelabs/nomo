import { DurableObjectBaseDelegate } from "../delegate";

export interface SearchConfig {
  table: string | { name: string };
  searchColumns: string[];
}

export class SearchDelegate extends DurableObjectBaseDelegate<SearchConfig> {
  async handle(
    queryText: string,
    options: { limit?: number; offset?: number } = {},
  ): Promise<unknown[]> {
    const { table, searchColumns } = this.config;
    const { limit = 20, offset = 0 } = options;

    if (!queryText) return [];

    const conditions = searchColumns.map((col) => `"${col}" LIKE ?`).join(" OR ");
    const searchVal = `%${queryText}%`;
    const values = searchColumns.map(() => searchVal);
    const tableName = typeof table === "string" ? table : table.name;

    const results = await this.durableObject.storage.sql
      .exec(`SELECT * FROM ${tableName} WHERE ${conditions} LIMIT ? OFFSET ?`, [
        ...values,
        limit,
        offset,
      ])
      .toArray();

    return results;
  }

  async paginate(
    page: number = 1,
    perPage: number = 20,
  ): Promise<{ data: unknown[]; total: number }> {
    const { table } = this.config;
    const offset = (page - 1) * perPage;
    const tableName = typeof table === "string" ? table : table.name;

    const results = await this.durableObject.storage.sql
      .exec(`SELECT * FROM ${tableName} LIMIT ? OFFSET ?`, [perPage, offset])
      .toArray();

    const countRes = await this.durableObject.storage.sql
      .exec(`SELECT COUNT(*) as count FROM ${tableName}`)
      .toArray();

    return { data: results, total: Number(countRes[0]?.count || 0) };
  }
}
