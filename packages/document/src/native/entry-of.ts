/* @layer core @kind logic */
import { crc32 } from './crc32';
import type { ManifestEntry } from './manifest.type';

const entryOf = (path: string, bytes: Uint8Array): ManifestEntry => ({
  path,
  length: bytes.length,
  crc32: crc32(bytes),
});

export { entryOf };
