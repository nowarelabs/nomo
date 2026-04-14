import { describe, expect, test } from "vite-plus/test";
import { Logger, LogLevel } from "../src/index.ts";

describe("Logger", () => {
  test("LogLevel enum values", () => {
    expect(LogLevel.DEBUG).toBe(0);
    expect(LogLevel.INFO).toBe(1);
    expect(LogLevel.WARN).toBe(2);
    expect(LogLevel.ERROR).toBe(3);
  });

  test("constructor accepts config", () => {
    const logger = new Logger({ service: "test" });
    expect(logger).toBeDefined();
  });

  test("logger methods exist", () => {
    const logger = new Logger({});
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
  });

  test("logger methods can be called", () => {
    const logger = new Logger({});
    logger.debug("debug message");
    logger.info("info message");
    logger.warn("warn message");
    logger.error("error message");
  });

  test("logger methods accept context", () => {
    const logger = new Logger({});
    logger.info("message", { key: "value" });
  });
});
