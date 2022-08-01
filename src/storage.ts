import type {
  LocalEngineOptions,
  S3EngineOptions,
  StorageEngine
} from "./engine/index.js";

export interface Storage {
  [key: string]: StorageEngine;
}

export interface S3StorageOptions {
  type: "s3";
  opts: S3EngineOptions;
}

export interface LocalStorageOptions {
  type: "local";
  opts: LocalEngineOptions;
}

export type StorageOptions = S3StorageOptions | LocalStorageOptions;
export type {
  LocalEngineOptions,
  S3EngineOptions,
  StorageEngine
} from "./engine/index.js";
