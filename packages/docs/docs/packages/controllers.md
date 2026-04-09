# Controllers

Rails-adjacent controllers for Nomo applications.

## BaseController

The `BaseController` is the foundation for all controllers in Nomo.

```typescript
import { BaseController } from 'nomo/controllers';

export class HomeController extends BaseController {
  protected service = null;

  async index() {
    return this.json({ message: 'Hello World' });
  }
}
```

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `request` | `Request` | The incoming HTTP request |
| `env` | `Env` | Environment variables |
| `params` | `Record<string, unknown>` | Request parameters (path, query, body) |
| `pathParams` | `Record<string, string>` | URL path parameters |
| `queryParams` | `Record<string, string>` | Query string parameters |
| `headers` | `Record<string, string>` | Request headers |
| `method` | `string` | HTTP method |
| `path` | `string` | Request path |
| `cookies` | `Record<string, string>` | Parsed cookies |

## Response Methods

```typescript
// JSON response
this.json(data, { status: 200 })

// Text response
this.text('Hello', { status: 200 })

// HTML response
this.html('<h1>Hello</h1>', { status: 200 })

// XML response
this.xml('<root></root>', { status: 200 })

// CSV response
this.csv('col1,col2\nval1,val2', { status: 200 })

// Excel (xlsx) response
this.xlsx(uint8Array, { status: 200 })

// Redirect
this.redirect_to('/new-path')

// File download with custom response
this.render({ text: 'content', headers: { 'Content-Disposition': 'attachment' } })
```

## Error Responses

```typescript
// 404 Not Found
return this.notFound('Resource not found')

// 401 Unauthorized
return this.unauthorized()

// 403 Forbidden
return this.forbidden()

// 400 Bad Request
return this.badRequest('Invalid input')

// 500 Internal Server Error
return this.internalServerError('Something went wrong')
```

## Before/After Actions

Define hooks that run before or after controller actions:

```typescript
export class UsersController extends BaseController {
  protected service = userService;

  static beforeActions = [
    {
      run: 'authenticate',
      only: ['edit', 'update', 'destroy']
    }
  ];

  async authenticate() {
    const token = this.headers['authorization'];
    if (!token) {
      return this.unauthorized();
    }
  }

  async index() {
    const users = await this.service.list();
    return this.json(users);
  }
}
```

## BaseResourceController

For RESTful CRUD controllers, extend `BaseResourceController`:

```typescript
import { BaseResourceController } from 'nomo/controllers';
import { UserModel } from './models/user';

export class UsersController extends BaseResourceController {
  protected service = userService;
  
  protected getModel() {
    return UserModel;
  }

  // RESTful actions: index, show, new, create, edit, update, destroy
  // Also supports: findAllBy, findByIds, pluck, trash, restore, etc.
}
```

### Resource Actions

| Action | Method | Description |
|--------|--------|-------------|
| `index` | GET | List all resources |
| `show` | GET | Show single resource |
| `new` | GET | Form for new resource |
| `create` | POST | Create new resource |
| `edit` | GET | Form for editing |
| `update` | PUT/PATCH | Update resource |
| `destroy` | DELETE | Delete resource |
| `trash` | POST | Soft delete |
| `restore` | POST | Restore from trash |
| `hide` | POST | Hide resource |
| `unhide` | POST | Unhide resource |

### Lifecycle Actions

```typescript
// Soft delete (trash)
async trash(id?: string)

// Restore from trash
async restore(id?: string)

// Soft hide
async hide(id?: string)
async unhide(id?: string)

// Flag/unflag
async flag(id?: string)
async unflag(id?: string)

// Hard delete
async purge(id?: string)

// Retire/unretire
async retire(id?: string)
async unretire(id?: string)
```

## Cookies

```typescript
// Set cookie
this.setCookie('session', 'abc123', {
  expires: new Date(Date.now() + 86400000),
  path: '/',
  httpOnly: true,
  secure: true,
  sameSite: 'Strict'
});

// Delete cookie
this.deleteCookie('session');
```

## Validation & Normalization

```typescript
import { IValidator, INormalizer } from 'nomo/controllers';

class UserValidator implements IValidator<User> {
  validate(): User {
    // validation logic
    return data;
  }
}

class UserNormalizer implements INormalizer<NormalizedUser> {
  normalize(): NormalizedUser {
    // normalization logic
    return data;
  }
}

// In controller
this.validate(UserValidator, inputData);
this.normalize(UserNormalizer, inputData);
```