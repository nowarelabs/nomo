# Normalizers

Data normalization utilities for Nomo applications.

## Basic Usage

```typescript
import { Normalizer } from 'nomo/normalizers';

class UserNormalizer extends Normalizer<{ id: string; displayName: string; avatarUrl: string }> {
  normalize(): { id: string; displayName: string; avatarUrl: string } {
    const data = this.data as any;
    
    return {
      id: String(data.id),
      displayName: data.name || data.email?.split('@')[0],
      avatarUrl: data.avatar?.url || `https://api.dicebear.com/7.x/initials/svg?seed=${data.name}`
    };
  }
}

// Use in controller
const normalized = this.normalize(UserNormalizer, rawData);
```

## Use Cases

- Transform API responses to internal format
- Sanitize user input
- Convert between data formats
- Flatten nested objects