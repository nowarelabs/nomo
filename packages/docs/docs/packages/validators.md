# Validators

Input validation utilities for Nomo applications.

## Basic Usage

```typescript
import { Validator, z } from 'nomo/validators';

class UserValidator extends Validator<{ name: string; email: string }> {
  validate(): { name: string; email: string } {
    const data = this.data as any;
    
    if (!data.name || data.name.length < 2) {
      throw new Error('Name must be at least 2 characters');
    }
    
    if (!data.email || !data.email.includes('@')) {
      throw new Error('Invalid email');
    }
    
    return { name: data.name, email: data.email };
  }
}

// Use in controller
const user = this.validate(UserValidator, this.body);
```

## Zod Integration

```typescript
import { z } from 'nomo/validators';

const UserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().optional()
});

// Validate
const data = UserSchema.parse(requestBody);
```

## Custom Validators

```typescript
class PasswordValidator extends Validator<string> {
  validate(): string {
    const password = this.data as string;
    
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    
    if (!/[A-Z]/.test(password)) {
      throw new Error('Password must contain uppercase letter');
    }
    
    return password;
  }
}
```