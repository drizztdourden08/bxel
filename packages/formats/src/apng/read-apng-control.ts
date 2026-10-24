/* @layer core @kind logic */
import { byteAt } from '../pixels/byte-at';
import { readU32 } from '../read-u32';
import { apngDelayMs } from './apng-delay-ms';
import type { ApngControl } from './apng.type';

const readU16Be = (bytes: Uint8Array, offset: number): number =>
  (byteAt(bytes, offset) << 8) | byteAt(bytes, offset + 1);

const readApngControl = (data: Uint8Array): ApngControl => ({
  sequence: readU32(data, 0),
  width: readU32(data, 4),
  height: readU32(data, 8),
  x: readU32(data, 12),
  y: readU32(data, 16),
  delayMs: apngDelayMs(readU16Be(data, 20), readU16Be(data, 22)),
  dispose: byteAt(data, 24),
  blend: byteAt(data, 25),
});

export { readApngControl };
