# Jobs

Background job processing for Nomo applications.

## Basic Usage

```typescript
import { BaseJob, JobRunner } from 'nomo/jobs';

class SendEmailJob extends BaseJob {
  static queue = 'emails';
  static retryLimit = 3;

  async perform(data: { to: string; subject: string; body: string }) {
    // Send email logic
    await sendEmail(data.to, data.subject, data.body);
  }
}

// Run job
const runner = new JobRunner({ env, ctx });
await runner.enqueue(SendEmailJob, { to: 'user@example.com', subject: 'Hello', body: '...' });
```

## Job Options

| Option | Type | Description |
|--------|------|-------------|
| `queue` | `string` | Queue name |
| `retryLimit` | `number` | Maximum retry attempts |
| `timeout` | `number` | Job timeout in seconds |
| `delay` | `number` | Delay before execution |

## Processing Jobs

```typescript
const handler = new JobHandler({
  env,
  queues: {
    emails: SendEmailJob,
    notifications: NotificationJob
  }
});

export default {
  async fetch(request, env, ctx) {
    return handler.handle(request);
  }
};
```