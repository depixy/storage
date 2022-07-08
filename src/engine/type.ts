import type { Readable } from "stream";

export interface StorageEngine {
  get(key: string): Promise<Readable>;
  set(key: string, stream: Readable): Promise<void>;
}
