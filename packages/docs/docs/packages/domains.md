# Domains

Workflow/Domain logic for Nomo applications.

## BaseDomain

```typescript
import { BaseDomain } from "nomo/domains";

export class OrderDomain extends BaseDomain {
  async createOrder(data: { userId: string; items: any[] }) {
    return this.perform(async () => {
      // Domain logic
      const order = await this.createOrderInDb(data);
      await this.sendConfirmationEmail(order);
      return order;
    });
  }

  protected async afterPerform(): Promise<void> {
    // Post-processing logic
    await this.logOrderCreated();
  }

  protected async onPerformError(error: unknown): Promise<void> {
    await this.notifyError(error);
  }
}
```

## Lifecycle Hooks

| Method                  | Description                      |
| ----------------------- | -------------------------------- |
| `beforePerform()`       | Runs before the main logic       |
| `afterPerform()`        | Runs after successful completion |
| `onPerformError(error)` | Runs on error                    |

## Usage

```typescript
const domain = new OrderDomain(env, ctx);
const order = await domain.createOrder({ userId: "1", items: [] });
```
