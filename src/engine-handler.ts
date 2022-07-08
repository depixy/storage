import type { StorageEngine } from "./engine/index.js";

export class EngineHandler {
  private readonly engines: Record<string, StorageEngine>;
  private key?: string;

  constructor() {
    this.engines = {};
  }

  use(key: string): void {
    if (!this.engines[key]) {
      throw new Error(`StorageEngine (${key}) is not registered`);
    }
    this.key = key;
  }

  private getEngine(): StorageEngine {
    if (!this.key) {
      throw new Error(
        "use() is not called to config which StorageEngine to use"
      );
    }
    return this.engines[this.key];
  }

  register(key: string, engine: StorageEngine): void {
    if (this.engines[key]) {
      throw new Error(`StorageEngine (${key}) is already registered`);
    }
    this.engines[key] = engine;
  }
}
