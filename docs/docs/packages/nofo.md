# NoFo

No-Transpiler DSL framework for Noware.

## Usage

```typescript
import { Component, define, html } from "noware/nofo";

@define("my-component")
class MyComponent extends Component {
  render() {
    return html` <div class="greeting">Hello, ${this.props.name}!</div> `;
  }
}
```

## Features

- No transpilation required
- Template literals for HTML
- Reactive props and state
- Custom elements registration
