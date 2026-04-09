# Logger

Structured logging with OpenTelemetry support.

## Basic Usage

```typescript
import { Logger, LogLevel } from 'nomo/logger';

const logger = new Logger({
  service: 'my-app',
  level: LogLevel.DEBUG,
  context: { environment: 'production' }
});

logger.info('Server started', { port: 8080 });
logger.debug('Processing request', { requestId: 'abc' });
logger.warn('High memory usage', { memory: '85%' });
logger.error('Request failed', { error: err.message }, err);
```

## Log Levels

```typescript
LogLevel.DEBUG   // 0
LogLevel.INFO    // 1
LogLevel.WARN    // 2
LogLevel.ERROR   // 3
LogLevel.FATAL   // 4
```

## Methods

| Method | Description |
|--------|-------------|
| `debug(message, attributes)` | Log debug message |
| `info(message, attributes)` | Log info message |
| `warn(message, attributes)` | Log warning message |
| `error(message, attributes, error?)` | Log error with optional Error object |
| `fatal(message, attributes, error?)` | Log fatal error |
| `setLevel(level)` | Set log level dynamically |
| `withContext(context)` | Create new logger with additional context |

## Configuration

```typescript
// Set environment globally
Logger.ENVIRONMENT = 'production';

// Set global log level
Logger.LEVEL = LogLevel.INFO;
```