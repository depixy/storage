import { assert } from "chai";
import { Readable } from "stream";
import { mkdir } from "fs/promises";
import { LocalStorage } from "../index.js";

import type { Stream } from "stream";

async function stream2string(stream: Stream): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
    stream.on("error", err => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

describe("LocalStorage", () => {
  let engine: LocalStorage;

  before(async () => {
    await mkdir("./tmp");
    engine = new LocalStorage({ path: "./tmp" });
  });

  describe("#set()", () => {
    it("should set data", async () => {
      const stream = new Readable();
      stream.push("test");
      stream.push(null);
      engine.set("upload/key", stream);
    });
  });

  describe("#get()", () => {
    it("should get data", async () => {
      const stream = await engine.get("upload/key");
      const data = await stream2string(stream);
      assert.strictEqual(data, "test", "data should be equal");
    });
  });

  describe("#exist()", () => {
    it("should return true", async () => {
      const exist = await engine.exist("upload/key");
      assert.isTrue(exist, "key should be exist");
    });

    it("should return false", async () => {
      const exist = await engine.exist("key");
      assert.isFalse(exist, "key should be exist");
    });
  });
});
