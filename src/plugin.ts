import { default as fastifyPlugin } from "fastify-plugin";
import { LocalEngine, S3Engine } from "./engine/index.js";
import { EngineHandler } from "./engine-handler.js";

import type { LocalEngineOptions, S3EngineOptions } from "./engine/index.js";

export interface DepixyStorageOptions {
  type: string;
  engine: {
    local?: LocalEngineOptions;
    s3?: S3EngineOptions;
  };
}

export const plugin = fastifyPlugin<DepixyStorageOptions>(
  async (fastify, opts) => {
    const { type, engine } = opts;
    const handler = new EngineHandler();
    if (engine.local) {
      handler.register("local", new LocalEngine(engine.local));
    }
    if (engine.s3) {
      handler.register("s3", new S3Engine(engine.s3));
    }
    handler.use(type);
    fastify.decorate("storage", handler);
  },
  {
    name: "@depixy/storage",
    dependencies: [],
    fastify: "4.x"
  }
);

declare module "fastify" {
  interface FastifyInstance {
    storage: EngineHandler;
  }
}
