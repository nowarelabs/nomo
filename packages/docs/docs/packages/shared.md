# Shared

Shared utilities for Nomo applications.

## Usage

```typescript
import { deepMerge, pick, omit, camelToSnake, snakeToCamel } from "nomo/shared";

// Object utilities
const merged = deepMerge(obj1, obj2);
const picked = pick(obj, ["id", "name"]);
const omitted = omit(obj, ["password"]);

// Case conversion
const snake = camelToSnake("userName"); // 'user_name'
const camel = snakeToCamel("user_name"); // 'userName'
```

## Utilities

| Function       | Description                     |
| -------------- | ------------------------------- |
| `deepMerge`    | Deep merge objects              |
| `pick`         | Pick specific keys              |
| `omit`         | Remove specific keys            |
| `camelToSnake` | Convert camelCase to snake_case |
| `snakeToCamel` | Convert snake_case to camelCase |
| `isEmpty`      | Check if object/array is empty  |
| `unique`       | Get unique array values         |
