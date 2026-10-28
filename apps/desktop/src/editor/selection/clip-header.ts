/* @layer renderer-app @kind logic */
import { CLIP_HEADER_INTS, INT_BYTES } from './clip-codec.constants';

interface ClipHeader {
  width: number;
  height: number;
  x: number;
  y: number;
  tableLength: number;
}

const clipHeader = (bytes: Uint8Array): ClipHeader | null => {
  if (bytes.length < CLIP_HEADER_INTS * INT_BYTES) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const [width = 0, height = 0, x = 0, y = 0, tableLength = 0] = Array.from({ length: CLIP_HEADER_INTS }, (_, at) => view.getInt32(at * INT_BYTES, true));
  const sane = width >= 1 && height >= 1 && tableLength >= 0;
  return sane && bytes.length === CLIP_HEADER_INTS * INT_BYTES + tableLength + width * height * 2 ? { width, height, x, y, tableLength } : null;
};

export { clipHeader };
export type { ClipHeader };
