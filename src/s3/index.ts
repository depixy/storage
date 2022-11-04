import { Client } from "minio";

import type { Readable } from "stream";
import type { ClientOptions } from "minio";
import type { Storage } from "../storage";

export interface S3StorageOptions extends ClientOptions {
  bucket: string;
}

export class S3Storage implements Storage {
  private client: Client;
  private bucket: string;

  public constructor(opts: S3StorageOptions) {
    const { bucket, ...minioOpts } = opts;
    this.bucket = bucket;
    this.client = new Client(minioOpts);
  }

  public async get(key: string): Promise<Readable> {
    return this.client.getObject(this.bucket, key);
  }

  public async set(key: string, stream: Readable): Promise<void> {
    await this.client.putObject(this.bucket, key, stream);
  }

  public async exist(key: string): Promise<boolean> {
    try {
      await this.client.statObject(this.bucket, key);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async remove(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }
}
