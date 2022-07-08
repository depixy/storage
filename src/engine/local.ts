import { accessSync, constants, existsSync } from "fs";
import { writeFile } from "fs/promises";
import { createReadStream } from "fs";
import { join, normalize } from "path";

import type { Readable } from "stream";
import type { StorageEngine } from "./type.js";

export interface LocalEngineOptions {
  path: string;
}

export class LocalEngine implements StorageEngine {
  private path: string;

  constructor(opts: LocalEngineOptions) {
    const { path } = opts;
    this.path = path;
    const exists = existsSync(path);
    if (!exists) {
      throw new Error(`${path} does not exists`);
    }
    try {
      accessSync(path, constants.R_OK | constants.W_OK);
    } catch (e) {
      throw new Error(`Failed to access ${path}`);
    }
  }

  private getPath(key: string): string {
    // Prevent escape from parent
    // eslint-disable-next-line prefer-named-capture-group
    const suffix = normalize(key).replace(/^(\.\.(\/|\\|$))+/u, "");
    return join(this.path, suffix);
  }

  async get(key: string): Promise<Readable> {
    const absPath = this.getPath(key);
    return createReadStream(absPath);
  }

  async set(key: string, stream: Readable): Promise<void> {
    const absPath = this.getPath(key);
    await writeFile(absPath, stream);
  }
}
