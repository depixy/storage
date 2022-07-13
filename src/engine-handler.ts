import type { Readable } from "stream";
import type { StorageEngine } from "./engine/index.js";

export class EngineHandler implements StorageEngine {
  private readonly engines: Record<string, StorageEngine>;
  private key?: string;

  constructor() {
    this.engines = {};
  }

  get(key: string): Promise<Readable> {
    return this.getEngine().get(key);
  }

  set(key: string, stream: Readable): Promise<void> {
    return this.getEngine().set(key, stream);
  }

  exist(key: string): Promise<boolean> {
    return this.getEngine().exist(key);
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
