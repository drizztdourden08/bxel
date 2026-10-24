/* @layer core @kind logic */
import { crc32 } from '@bxel/document/native';

const entryOf = (path: string, bytes: Uint8Array) => ({ path, length: bytes.length, crc32: crc32(bytes) });

export { entryOf };
