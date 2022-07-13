import { assert } from "chai";
import { Readable } from "stream";
import { S3Engine } from "../s3.js";

import type { Stream } from "stream";

async function stream2string(stream: Stream): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const chunks: any[] = [];
    stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
    stream.on("error", err => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

describe("S3Engine", () => {
  let engine: S3Engine;

  before(async () => {
    engine = new S3Engine({
      bucket: "depixy",
      endPoint: "localhost",
      useSSL: false,
      port: 9000,
      accessKey: "minio",
      secretKey: "minio123"
    });
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

  describe("#exist()", () => {
    it("should return true", async () => {
      const exist = await engine.exist("key");
      assert.isTrue(exist, "key should be exist");
    });

    it("should return false", async () => {
      const exist = await engine.exist("key2");
      assert.isFalse(exist, "key should be exist");
    });
  });
});
