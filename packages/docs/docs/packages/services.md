# Services

Base service class for Nomo applications.

## BaseService

```typescript
import { BaseService } from 'nomo/services';

export class UserService extends BaseService {
  async getUser(id: string) {
    const result = await this.db.prepare('SELECT * FROM users WHERE id = ?').bind(id).first();
    return result;
  }

  async createUser(data: { name: string; email: string }) {
    const result = await this.db.prepare(
      'INSERT INTO users (name, email) VALUES (?, ?)'
    ).bind(data.name, data.email);
    return result;
  }
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `req` | `Request` | The incoming request |
| `env` | `Env` | Environment variables |
| `ctx` | `RouterContext` | Router context |
| `logger` | `Logger` | Logger instance |
| `db` | `D1Database` | D1 database instance |

## Creating Service Context

```typescript
// Create a child service context
const childCtx = this.createServiceContext('UserService', {
  operation: 'create'
});
```

## Usage in Controllers

```typescript
import { BaseController } from 'nomo/controllers';
import { UserService } from './services/user';

export class UserController extends BaseController {
  protected service = new UserService(this.request, this.env, this.ctx);

  async show() {
    const user = await this.service.getUser(this.params.id);
    if (!user) {
      return this.notFound();
    }
    return this.json(user);
  }
}
```