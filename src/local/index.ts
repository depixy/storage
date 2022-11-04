import { accessSync, constants } from "fs";
import { access, mkdir, stat, unlink, writeFile } from "fs/promises";
import { createReadStream } from "fs";
import { dirname, join, normalize } from "path";

import type { Readable } from "stream";
import type { Storage } from "../storage.js";

export interface LocalStorageOptions {
  path: string;
}

export class LocalStorage implements Storage {
  private path: string;

  public constructor(opts: LocalStorageOptions) {
    const { path } = opts;
    this.path = path;
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

  public async get(key: string): Promise<Readable> {
    const absPath = this.getPath(key);
    return createReadStream(absPath);
  }

  public async set(key: string, stream: Readable): Promise<void> {
    const absPath = this.getPath(key);
    const parent = dirname(absPath);
    await mkdir(parent, { recursive: true });
    await writeFile(absPath, stream);
  }

  public async exist(key: string): Promise<boolean> {
    const absPath = this.getPath(key);
    try {
      await access(absPath, constants.R_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async remove(key: string): Promise<void> {
    const absPath = this.getPath(key);
    const stats = await stat(absPath);
    if (!stats.isFile()) {
      return;
    }
    await unlink(absPath);
  }
}
