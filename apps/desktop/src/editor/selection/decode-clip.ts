/* @layer renderer-app @kind logic */
import { CLIP_HEADER_INTS, INT_BYTES } from './clip-codec.constants';
import type { CarriedClip } from './clip-codec.type';
import { clipHeader } from './clip-header';

const decodeClip = (bytes: Uint8Array): CarriedClip | null => {
  const header = clipHeader(bytes);
  if (!header) return null;
  const head = CLIP_HEADER_INTS * INT_BYTES;
  const cells = header.width * header.height;
  const table = bytes.slice(head, head + header.tableLength);
  const pixels = bytes.slice(head + header.tableLength, head + header.tableLength + cells);
  const bits = bytes.slice(head + header.tableLength + cells);
  return { clip: { width: header.width, height: header.height, origin: { x: header.x, y: header.y }, pixels, bits }, table };
};

export { decodeClip };
