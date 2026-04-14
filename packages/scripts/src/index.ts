/**
 * noware-scripts - Build Scripts
 *
 * Standard Gauge: Build Scripts (Tier 0)
 *
 * Connection: CLI tools for project setup
 */

import type { RequestLike, ContextLike } from "noware-shared";

export const GENERATORS = {
  controller: (name: string) => `// Controller template`,
  service: (name: string) => `// Service template`,
  model: (name: string) => `// Model template`,
};

export class ScriptRunner {
  constructor(
    protected request?: RequestLike,
    protected env?: Record<string, unknown>,
    protected ctx?: ContextLike,
  ) {}
}
