/**
 * noware-scripts - Build Scripts
 * 
 * Standard Gauge: Build Scripts (Tier 0)
 * 
 * Connection: CLI tools for project setup
 */

export const GENERATORS = {
  controller: (name: string) => `// Controller template`,
  service: (name: string) => `// Service template`,
  model: (name: string) => `// Model template`,
};