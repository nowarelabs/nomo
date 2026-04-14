/**
 * noware-plugins - Plugin Registry
 * 
 * Standard Gauge: Plugin System (infrastructure)
 * 
 * Connection: Extends functionality at static points
 */

export interface Plugin {
  name: string;
  install(): void;
}

export class PluginRegistry {
  static plugins: Plugin[] = [];
  
  static register(plugin: Plugin): void {
    this.plugins.push(plugin);
  }
}