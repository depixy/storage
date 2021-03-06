import { default as fastifyPlugin } from "fastify-plugin";
import { LocalEngine, S3Engine } from "./engine/index.js";

import type { LocalEngineOptions, S3EngineOptions } from "./engine/index.js";
import type { Storage } from "./storage.js";

export interface S3StorageOptions {
  type: "s3";
  opts: S3EngineOptions;
}

export interface LocalStorageOptions {
  type: "local";
  opts: LocalEngineOptions;
}

export interface DepixyStorageOptions {
  storages: {
    [key: string]: S3StorageOptions | LocalStorageOptions;
  };
}

export const plugin = fastifyPlugin<DepixyStorageOptions>(
  async (fastify, opts) => {
    const { storages } = opts;

    const storage: Storage = {};
    for (const [key, value] of Object.entries(storages)) {
      switch (value.type) {
        case "s3":
          storage[key] = new S3Engine(value.opts);
          break;
        case "local":
          storage[key] = new LocalEngine(value.opts);
          break;
        default:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          fastify.log.warn(`Ignore unknown storage type: (${value.type})`);
      }
    }
    fastify.decorate("storage", storage);
  },
  {
    name: "@depixy/storage",
    dependencies: [],
    fastify: "4.x"
  }
);

declare module "fastify" {
  interface FastifyInstance {
    storage: Storage;
  }
}
