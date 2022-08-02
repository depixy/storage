import { Client } from "minio";

import type { Readable } from "stream";
import type { ClientOptions } from "minio";
import type { StorageEngine } from "./type.js";

export interface S3EngineOptions extends ClientOptions {
  bucket: string;
}

export class S3Engine implements StorageEngine {
  private client: Client;
  private bucket: string;

  constructor(opts: S3EngineOptions) {
    const { bucket, ...minioOpts } = opts;
    this.bucket = bucket;
    this.client = new Client(minioOpts);
  }

  async get(key: string): Promise<Readable> {
    return this.client.getObject(this.bucket, key);
  }

  async set(key: string, stream: Readable): Promise<void> {
    await this.client.putObject(this.bucket, key, stream);
  }

  async exist(key: string): Promise<boolean> {
    try {
      await this.client.statObject(this.bucket, key);
      return true;
    } catch (e) {
      return false;
    }
  }

  async remove(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }
}
