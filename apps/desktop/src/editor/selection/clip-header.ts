/* @layer renderer-app @kind logic */
import { CLIP_HEADER_INTS, INT_BYTES } from './clip-codec.constants';
import type { ClipHeader } from './clip-header.type';

const readInts = (bytes: Uint8Array): number[] => {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return Array.from({ length: CLIP_HEADER_INTS }, (_, at) => view.getInt32(at * INT_BYTES, true));
};

const isSane = (header: ClipHeader, length: number): boolean =>
  header.width >= 1 && header.height >= 1 && header.tableLength >= 0 && length === CLIP_HEADER_INTS * INT_BYTES + header.tableLength + header.width * header.height * 2;

const clipHeader = (bytes: Uint8Array): ClipHeader | null => {
  if (bytes.length < CLIP_HEADER_INTS * INT_BYTES) return null;
  const [width = 0, height = 0, x = 0, y = 0, tableLength = 0] = readInts(bytes);
  const header = { width, height, x, y, tableLength };
  return isSane(header, bytes.length) ? header : null;
};

export { clipHeader };
