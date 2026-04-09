# Views

JSX-based view rendering for Nomo applications.

## Basic Usage

```typescript
import { BaseView, BaseLayout } from 'nomo/views';

// Define a view component
class UserView extends BaseView {
  render(data: { user: { name: string; email: string } }) {
    return (
      <div class="user-profile">
        <h1>{data.user.name}</h1>
        <p>{data.user.email}</p>
      </div>
    );
  }
}

// Use in controller
return this.render({
  view: UserView,
  data: { user: { name: 'John', email: 'john@example.com' } }
});
```

## Layouts

```typescript
import { BaseLayout } from 'nomo/views';

class MainLayout extends BaseLayout {
  render(content: string, data: any) {
    return (
      <html>
        <head>
          <title>{data.title || 'Nomo App'}</title>
        </head>
        <body>
          <nav>Navigation</nav>
          <main>{content}</main>
          <footer>Footer</footer>
        </body>
      </html>
    );
  }
}

// Use with view
return this.render({
  view: UserView,
  layout: MainLayout,
  data: { user: userData }
});
```

## JSON/XML Views

```typescript
import { BaseDtoView } from 'nomo/views';

class UserDtoView extends BaseDtoView {
  static renderJson(user: any) {
    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }

  static renderXml(user: any) {
    return `<user><id>${user.id}</id><name>${user.name}</name></user>`;
  }
}
```

## View Options

| Option | Description |
|--------|-------------|
| `view` | View component class |
| `layout` | Layout component class |
| `data` | Data to pass to view |
| `json` | Direct JSON response |
| `html` | Direct HTML response |