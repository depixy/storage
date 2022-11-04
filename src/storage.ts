import type { Readable } from "stream";

export interface Storage {
  get: (key: string) => Promise<Readable>;
  set: (key: string, stream: Readable) => Promise<void>;
  exist: (key: string) => Promise<boolean>;
  remove: (key: string) => Promise<void>;
}
