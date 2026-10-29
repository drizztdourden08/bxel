/* @layer renderer-app @kind logic */
import { CLIP_HEADER_INTS, INT_BYTES } from './clip-codec.constants';
import type { Clip } from './selection.type';

const encodeClip = (clip: Clip, table: Uint8Array): Uint8Array => {
  const head = CLIP_HEADER_INTS * INT_BYTES;
  const out = new Uint8Array(head + table.length + clip.pixels.length + clip.bits.length);
  const view = new DataView(out.buffer);
  [clip.width, clip.height, clip.origin.x, clip.origin.y, table.length].forEach((value, at) => view.setInt32(at * INT_BYTES, value, true));
  out.set(table, head);
  out.set(clip.pixels, head + table.length);
  out.set(clip.bits, head + table.length + clip.pixels.length);
  return out;
};

export { encodeClip };
