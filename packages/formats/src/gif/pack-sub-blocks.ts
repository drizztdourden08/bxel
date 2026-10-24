/* @layer core @kind logic */
import { GIF_LIMITS } from './gif-limits.constants';

const packSubBlocks = (data: Uint8Array): Uint8Array => {
  const max = GIF_LIMITS.SUB_BLOCK_MAX;
  const blocks = Math.ceil(data.length / max);
  const out = new Uint8Array(data.length + blocks + 1);
  let at = 0;
  for (let start = 0; start < data.length; start += max) {
    const chunk = data.subarray(start, start + max);
    out[at] = chunk.length;
    out.set(chunk, at + 1);
    at += chunk.length + 1;
  }
  return out;
};

export { packSubBlocks };
