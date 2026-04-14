# Result

Result/Either type for error handling.

## Basic Usage

```typescript
import { Result, Ok, Err } from "noware/result";

// Success
const ok: Result<number, string> = Ok(42);

// Error
const err: Result<number, string> = Err("Something went wrong");

// Using factory
const result = Result.from(() => potentiallyFailingOperation());
```

## Methods

```typescript
// Map success value
const mapped = result.map((value) => value * 2);

// Map error
const mappedErr = result.mapErr((error) => new CustomError(error));

// Chain operations
const chained = result.andThen((value) => Ok(value + 1));

// Pattern matching
result.match({
  Ok: (value) => console.log(value),
  Err: (error) => console.error(error),
});

// Get value or default
const value = result.unwrapOr(0);

// Get value or throw
const valueOrThrow = result.unwrap();

// Check if success/failure
if (result.isOk()) {
  /* ... */
}
if (result.isErr()) {
  /* ... */
}
```

## Use Cases

- Explicit error handling without exceptions
- Chaining operations that may fail
- Railway-oriented programming
