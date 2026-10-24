/* @layer core @kind constants */
import { ASSET_FORMAT_VERSION, ASSET_MIN_READER_VERSION } from '@bxel/document/native';

const CONTAINER_ENTRY = {
  mimetype: 'mimetype',
  manifest: 'manifest.json',
  document: 'project.json',
  preview: 'preview.png',
} as const;

const ASSETS_DIR = 'assets/';
const CONTAINER_FORMAT = 'bxel';
const CONTAINER_VERSION = ASSET_FORMAT_VERSION;
const CONTAINER_MIN_READER = ASSET_MIN_READER_VERSION;
const CONTAINER_WRITER = { app: 'Bxel', version: '0.1.0' } as const;
const JSON_INDENT = 2;
const DEFLATE_LEVEL = 6;
const STORED_LEVEL = 0;
const ZIP_MTIME = new Date(1980, 0, 1, 0, 0, 0);
const ZIP_SIGNATURE = [0x50, 0x4b, 0x03, 0x04] as const;
const MEGABYTE = 1024 * 1024;
const CONTAINER_LIMITS = {
  maxFileBytes: 512 * MEGABYTE,
  maxEntryBytes: 64 * MEGABYTE,
  maxTotalBytes: 1024 * MEGABYTE,
} as const;

export {
  ASSETS_DIR,
  CONTAINER_ENTRY,
  CONTAINER_FORMAT,
  CONTAINER_LIMITS,
  CONTAINER_MIN_READER,
  CONTAINER_VERSION,
  CONTAINER_WRITER,
  DEFLATE_LEVEL,
  JSON_INDENT,
  STORED_LEVEL,
  ZIP_MTIME,
  ZIP_SIGNATURE,
};
