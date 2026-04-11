import { describe, it, expect, vi, beforeEach } from "vitest";
import { MigrationRunner } from "../runner";
import { Migration, type Database } from "../index";
import { ok } from "nomo/result";

vi.mock("drizzle-orm", () => {
  const sqlMock = (chunks: TemplateStringsArray, ...vals: unknown[]) => {
    let sql = "";
    for (let i = 0; i < chunks.length; i++) {
      sql += chunks[i];
      if (i < vals.length) {
        const val = vals[i];
        sql +=
          typeof val === "object" && val !== null && "sql" in val
            ? (val as { sql: string }).sql
            : val !== undefined
              ? String(val)
              : "";
      }
    }
    return { sql, __isSql: true };
  };
  (sqlMock as unknown as { raw: (str: string) => { sql: string; __isSql: true } }).raw = (
    str: string,
  ) => ({ sql: str, __isSql: true });
  return { sql: sqlMock };
});

// Mock migrations
class Migration1 extends Migration {
  readonly version = "20260101000000";
  async change() {}
}

class Migration2 extends Migration {
  readonly version = "20260102000000";
  async change() {}
}

type MockDb = Database & {
  run: ReturnType<typeof vi.fn>;
  all: ReturnType<typeof vi.fn>;
};

describe("MigrationRunner", () => {
  let mockDb: MockDb;
  let runner: MigrationRunner;
  let migrations: Migration[];

  beforeEach(() => {
    mockDb = {
      run: vi.fn().mockResolvedValue(ok({})),
      all: vi.fn().mockResolvedValue(ok([])),
    } as MockDb;
    runner = new MigrationRunner(mockDb);
    migrations = [new Migration1(mockDb), new Migration2(mockDb)];
  });

  it("ensures migrations table exists", async () => {
    await runner.ensureMigrationsTable();
    expect(mockDb.run).toHaveBeenCalledWith(expect.anything());
  });

  it("runs pending migrations up", async () => {
    mockDb.all.mockResolvedValueOnce(ok([])); // No migrations applied
    await runner.use(migrations).up();

    expect(mockDb.run).toHaveBeenCalledWith(stringWith("INSERT INTO schema_migrations"));
    expect(mockDb.run).toHaveBeenCalledTimes(3); // 1 table check + 2 inserts (M1, M2 empty)
  });

  it("only runs pending migrations", async () => {
    mockDb.all.mockResolvedValueOnce(ok([{ version: "20260101000000" }])); // M1 applied
    await runner.use(migrations).up();

    expect(mockDb.run).not.toHaveBeenCalledWith(expect.stringContaining("20260101000000"));
  });

  it("rolls back specific number of steps", async () => {
    mockDb.all.mockResolvedValue(
      ok([{ version: "20260101000000" }, { version: "20260102000000" }]),
    );
    await runner.use(migrations).rollback(1);

    expect(mockDb.run).toHaveBeenCalledWith(
      stringWith("DELETE FROM schema_migrations WHERE version = 20260102000000"),
    );
  });

  it("resets the database", async () => {
    mockDb.all.mockResolvedValueOnce(ok([{ name: "users" }, { name: "posts" }])); // tables
    mockDb.all.mockResolvedValueOnce(ok([])); // applied migrations after clearing
    await runner.use(migrations).reset();

    expect(mockDb.run).toHaveBeenCalledWith(stringWith("DROP TABLE IF EXISTS users"));
    expect(mockDb.run).toHaveBeenCalledWith(stringWith("DROP TABLE IF EXISTS posts"));
  });
});

// Helper for matching SQL in mocked objects
function stringWith(str: string) {
  return expect.objectContaining({
    sql: expect.stringContaining(str),
  });
}
