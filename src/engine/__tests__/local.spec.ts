import { assert } from "chai";
import { Readable } from "stream";
import { mkdir } from "fs/promises";
import { LocalEngine } from "../local.js";

import type { Stream } from "stream";

async function stream2string(stream: Stream): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
    stream.on("error", err => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

describe("LocalEngine", () => {
  let engine: LocalEngine;

  before(async () => {
    await mkdir("./tmp");
    engine = new LocalEngine({ path: "./tmp" });
  });

  describe("#set()", () => {
    it("should set data", async () => {
      const stream = new Readable();
      stream.push("test");
      stream.push(null);
      engine.set("key", stream);
    });
  });

  describe("#get()", () => {
    it("should get data", async () => {
      const stream = await engine.get("key");
      const data = await stream2string(stream);
      assert.strictEqual(data, "test", "data should be equal");
    });
  });
});
