import { describe, it, expect } from "vitest";
import { Migration, type Database } from "../index";
import { SqlGenerator, type MigrationAction } from "../sql";
import { ok } from "nomo/result";
import type { MigrationCommand } from "../index";

class MockMigration extends Migration {
  readonly version = "20260205120000";
  async change() {
    this.renameTable("users", "accounts");
    this.addColumn("accounts", "last_login", "timestamp");
    this.removeColumn("accounts", "old_column");
    this.renameColumn("accounts", "name", "full_name");

    this.changeColumn("accounts", "status", "string", { default: "active" });
    this.changeColumnDefault("accounts", "priority", 1);
    this.changeColumnNull("accounts", "email", false);

    this.addIndex("accounts", ["email"], { unique: true });
    this.removeIndex("accounts", ["old_index"]);

    this.addForeignKey("accounts", "roles", { column: "role_id" });
    this.removeForeignKey("accounts", { column: "old_fk_id" });
  }
}

describe("Migration Modification Methods", () => {
  const sql = new SqlGenerator();

  it("records and generates SQL for table and column modifications", async () => {
    const mockDb = {
      run: async () => ok({}),
      all: async () =>
        ok([
          { name: "status", type: "TEXT", notnull: 0, dflt_value: null, pk: 0 },
          {
            name: "priority",
            type: "INTEGER",
            notnull: 0,
            dflt_value: 0,
            pk: 0,
          },
          { name: "email", type: "TEXT", notnull: 0, dflt_value: null, pk: 0 },
          {
            name: "role_id",
            type: "INTEGER",
            notnull: 0,
            dflt_value: null,
            pk: 0,
          },
          {
            name: "old_fk_id",
            type: "INTEGER",
            notnull: 0,
            dflt_value: null,
            pk: 0,
          },
        ]),
    };
    const migration = new MockMigration(mockDb as Database);
    migration._inChange = true;
    await migration.change();

    const commands = migration._commands;
    const isObjWithType = (cmd: MigrationCommand): boolean =>
      typeof cmd.up === "object" && cmd.up !== null && "type" in cmd.up;
    const queries = commands.map((cmd) => {
      const res = isObjWithType(cmd) ? sql.generate(cmd.up as MigrationAction) : null;
      expect(res?.success).toBe(true);
      return res?.data;
    });

    expect(queries).toContain('ALTER TABLE "users" RENAME TO "accounts";');
    expect(queries).toContain('ALTER TABLE "accounts" ADD COLUMN "last_login" TEXT;');
    expect(queries).toContain('ALTER TABLE "accounts" DROP COLUMN "old_column";');
    expect(queries).toContain('ALTER TABLE "accounts" RENAME COLUMN "name" TO "full_name";');

    // In SQLite mode, these now trigger recreateTable
    expect(
      commands.some((c) => isObjWithType(c) && (c.up as MigrationAction).type === "recreateTable"),
    ).toBe(true);

    expect(queries).toContain(
      'CREATE UNIQUE INDEX IF NOT EXISTS "idx_accounts_email" ON "accounts" ("email");',
    );
    expect(queries).toContain('DROP INDEX IF EXISTS "idx_accounts_old_index";');
  });
});
