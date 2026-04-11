import { describe, it, expect, vi } from "vitest";
import { Migration, TableBuilder, type Database, type MigrationCommand } from "../index";
import { SqlGenerator, type MigrationAction } from "../sql";
import { ok, type Result } from "nomo/result";

class CompositePkMigration extends Migration {
  readonly version = "20260211000001";
  async change() {
    this.createTable("user_roles", { primaryKey: ["user_id", "role_id"] }, (t) => {
      t.integer("user_id");
      t.integer("role_id");
    });
  }
}

class ChangeColumnMigration extends Migration {
  readonly version = "20260211000002";
  async change() {
    await this.changeColumn("users", "age", "integer", { default: 21 });
  }
}

describe("New Migration Features", () => {
  const sqlite = new SqlGenerator("sqlite");

  it("generates SQL for composite primary keys", async () => {
    const mockDb = {
      run: vi.fn().mockResolvedValue(ok({})),
      all: vi.fn().mockResolvedValue(ok([])),
    } as unknown as Database;
    const migration = new CompositePkMigration(mockDb);
    migration._inChange = true;
    await migration.change();

    const commands = migration._commands;
    const hasUpType = (cmd: MigrationCommand): boolean =>
      typeof cmd.up === "object" && cmd.up !== null && "type" in cmd.up;
    const createCmd = commands.find(
      (c) => hasUpType(c) && (c.up as MigrationAction).type === "createTable",
    );
    const res = sqlite.generate(createCmd!.up as MigrationAction);
    expect(res.success).toBe(true);
    const generatedSql = res.data;

    expect(generatedSql).toContain('PRIMARY KEY ("user_id", "role_id")');
  });

  it("implements reflection-based changeColumn", async () => {
    const mockDb = {
      run: vi.fn().mockResolvedValue(ok({})),
      all: vi.fn().mockResolvedValue(
        ok([
          { name: "id", type: "INTEGER", notnull: 1, dflt_value: null, pk: 1 },
          { name: "name", type: "TEXT", notnull: 0, dflt_value: null, pk: 0 },
          { name: "age", type: "INTEGER", notnull: 0, dflt_value: 18, pk: 0 },
        ]),
      ),
    } as unknown as Database;

    const migration = new ChangeColumnMigration(mockDb);
    migration._inChange = true;
    const changeRes = await migration.change();
    const resData = changeRes as Result<void> | undefined;
    expect(resData?.success === true || resData === undefined).toBe(true);

    // Verify recreateTable was triggered
    const commands = migration._commands;
    const hasUpType = (cmd: MigrationCommand): boolean =>
      typeof cmd.up === "object" && cmd.up !== null && "type" in cmd.up;
    const recreateCmd = commands.find(
      (c) => hasUpType(c) && (c.up as MigrationAction).type === "recreateTable",
    );
    expect(recreateCmd).toBeDefined();

    const table = (recreateCmd!.up as MigrationAction).table as TableBuilder;
    const ageCol = table.columns.find((c) => c.name === "age");
    expect(ageCol?.options.default).toBe(21);

    const res = sqlite.generate(recreateCmd!.up as MigrationAction);
    expect(res.success).toBe(true);
    const generatedSql = res.data;
    expect(generatedSql).toContain("PRAGMA FOREIGN_KEYS=OFF;");
    expect(generatedSql).toContain('ALTER TABLE "users" RENAME TO "old_users";');
    expect(generatedSql).toContain('CREATE TABLE IF NOT EXISTS "users"');
    expect(generatedSql).toContain(
      'INSERT INTO "users" ("id", "name", "age") SELECT "id", "name", "age" FROM "old_users";',
    );
    expect(generatedSql).toContain('DROP TABLE "old_users";');
    expect(generatedSql).toContain("PRAGMA FOREIGN_KEYS=ON;");
  });

  it("supports changeTable DSL for grouping modifications", async () => {
    const mockDb = {
      run: vi.fn().mockResolvedValue(ok({})),
      all: vi.fn().mockResolvedValue(
        ok([
          { name: "id", type: "INTEGER", notnull: 1, dflt_value: null, pk: 1 },
          { name: "email", type: "TEXT", notnull: 0, dflt_value: null, pk: 0 },
        ]),
      ),
    } as unknown as Database;

    class ChangeTableMigration extends Migration {
      readonly version = "20260211000003";
      async change() {
        await this.changeTable("users", (t) => {
          t.addColumn("last_seen_at", "timestamp");
          t.changeColumnDefault("email", "anonymous@example.com");
        });
      }
    }

    const migration = new ChangeTableMigration(mockDb as Database);
    migration._inChange = true;
    await migration.change();

    const commands = migration._commands;
    const hasUpType = (cmd: MigrationCommand): boolean =>
      typeof cmd.up === "object" && cmd.up !== null && "type" in cmd.up;
    expect(
      commands.some((c) => hasUpType(c) && (c.up as MigrationAction).type === "addColumn"),
    ).toBe(true);
    expect(
      commands.some((c) => hasUpType(c) && (c.up as MigrationAction).type === "recreateTable"),
    ).toBe(true);
  });

  it("supports reversible logic for custom up/down blocks", async () => {
    const mockDb = {
      run: vi.fn().mockResolvedValue(ok({})),
      all: vi.fn().mockResolvedValue(ok([])),
    };
    const upSpy = vi.fn();
    const downSpy = vi.fn();

    class ReversibleMigration extends Migration {
      readonly version = "20260211000005";
      async change() {
        await this.reversible({
          up: upSpy,
          down: downSpy,
        });
      }
    }

    const migration = new ReversibleMigration(mockDb as Database);

    // Test Up
    migration._isUp = true;
    await migration.change();
    expect(upSpy).toHaveBeenCalled();
    expect(downSpy).not.toHaveBeenCalled();

    vi.clearAllMocks();

    // Test Down
    migration._isUp = false;
    await migration.change();
    expect(downSpy).toHaveBeenCalled();
    expect(upSpy).not.toHaveBeenCalled();
  });
});
