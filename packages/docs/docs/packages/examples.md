# Examples

Practical code examples for common use cases.

## REST API Controller

```typescript
import { BaseResourceController, get, post, put, del } from 'nomo/controllers';
import { UserService } from '../services/user';
import { UserModel } from '../models/user';

export class UsersController extends BaseResourceController {
  protected service = new UserService(this.request, this.env, this.ctx);
  
  protected getModel() {
    return UserModel;
  }

  // RESTful actions: index, show, create, update, destroy
  // All handled automatically by BaseResourceController
}
```

## Custom Service

```typescript
import { BaseService } from 'nomo/services';

export class EmailService extends BaseService {
  async sendWelcomeEmail(user: { email: string; name: string }) {
    const response = await this.fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        to: user.email,
        from: 'noreply@example.com',
        subject: 'Welcome!',
        text: `Hello ${user.name}, welcome to our app!`
      })
    });
    
    return response.ok;
  }
}
```

## Database Model with Relationships

```typescript
import { BaseModel } from 'nomo/models';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull()
});

const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id),
  title: text('title').notNull(),
  content: text('content')
});

export class UserModel extends BaseModel {
  table = users;
}

export class PostModel extends BaseModel {
  table = posts;
}

// Usage with eager loading
const usersWithPosts = await UserModel.query()
  .findAllWith({ status: 'active' }, {
    posts: { model: PostModel, foreignKey: 'userId' }
  });
```

## Authentication Middleware

```typescript
import { BaseController } from 'nomo/controllers';

export class AuthController extends BaseController {
  protected service = null;

  static beforeActions = [
    {
      run: 'requireAuth',
      except: ['login', 'register']
    }
  ];

  async requireAuth() {
    const token = this.headers['authorization'];
    
    if (!token) {
      return this.unauthorized('No token provided');
    }

    // Verify token (implement your logic)
    const user = await this.verifyToken(token);
    
    if (!user) {
      return this.unauthorized('Invalid token');
    }

    this._currentUser = user;
  }

  async login() {
    const { email, password } = this.body;
    
    const user = await this.validateCredentials(email, password);
    
    if (!user) {
      return this.badRequest('Invalid credentials');
    }

    const token = this.generateToken(user.id);
    
    return this.json({ token, user: { id: user.id, email: user.email } });
  }
}
```

## Using Durable Objects

```typescript
import { DurableObject } from 'nomo/durable-objects';

export class ChatRoom extends DurableObject {
  async onMessage(message: string) {
    // Store message in DO storage
    const messages = await this.storage.get('messages') || [];
    messages.push({
      text: message,
      timestamp: Date.now()
    });
    await this.storage.put('messages', messages);
    
    // Broadcast to all connected clients
    this.notifyClients(message);
  }

  async onConnect(request: Request): Promise<Response> {
    // Handle WebSocket connection
    const [client, server] = new WebSocketPair();
    
    this.addClient(client);
    
    return new Response(null, { status: 101, webSocket: server });
  }
}
```

## Background Jobs

```typescript
import { BaseJob } from 'nomo/jobs';

class SendEmailJob extends BaseJob {
  static queue = 'emails';
  static retryLimit = 3;

  async perform(data: { to: string; subject: string; body: string }) {
    // Send email logic here
    await sendEmail(data.to, data.subject, data.body);
  }
}

// Enqueue a job
import { JobRunner } from 'nomo/jobs';

const runner = new JobRunner({ env, ctx });
await runner.enqueue(SendEmailJob, {
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Thanks for signing up!'
});
```

## Error Handling

```typescript
import { BaseController } from 'nomo/controllers';

export class ApiController extends BaseController {
  protected service = null;

  async getData() {
    try {
      const data = await this.fetchExternalApi();
      return this.json(data);
    } catch (error) {
      this.logger.error('Failed to fetch data', { error: error.message });
      return this.internalServerError('Failed to fetch data');
    }
  }
}
```