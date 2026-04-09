# NoFo

No-Transpiler DSL framework for Nomo.

## Usage

```typescript
import { Component, define, html } from 'nomo/nofo';

@define('my-component')
class MyComponent extends Component {
  render() {
    return html`
      <div class="greeting">
        Hello, ${this.props.name}!
      </div>
    `;
  }
}
```

## Features

- No transpilation required
- Template literals for HTML
- Reactive props and state
- Custom elements registration