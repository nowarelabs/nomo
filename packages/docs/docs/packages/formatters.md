# Formatters

Output formatting utilities for Nomo applications.

## Basic Usage

```typescript
import { Formatter } from 'nomo/formatters';

class DateFormatter extends Formatter<Date> {
  format(): string {
    const date = this.data as Date;
    return date.toISOString();
  }
}

// Use in controller
const formatted = this.format(DateFormatter, new Date());
```

## Common Formatters

```typescript
// Currency
class CurrencyFormatter extends Formatter<number> {
  format(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(this.data as number);
  }
}

// Relative time
class RelativeTimeFormatter extends Formatter<Date> {
  format(): string {
    const diff = Date.now() - (this.data as Date).getTime();
    // Return relative time string
  }
}
```