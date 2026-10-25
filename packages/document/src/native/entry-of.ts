/* @layer core @kind logic */
import { crc32 } from './crc32';
import type { ManifestEntry } from './manifest.type';

const checksums = new WeakMap<Uint8Array, string>();

const checksumOf = (bytes: Uint8Array): string => {
  const known = checksums.get(bytes);
  if (known !== undefined) return known;
  const fresh = crc32(bytes);
  checksums.set(bytes, fresh);
  return fresh;
};

const entryOf = (path: string, bytes: Uint8Array): ManifestEntry => ({
  path,
  length: bytes.length,
  crc32: checksumOf(bytes),
});

export { entryOf };
