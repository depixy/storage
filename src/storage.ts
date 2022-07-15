import type { StorageEngine } from "./engine/index.js";

export interface Storage {
  [key: string]: StorageEngine;
}
