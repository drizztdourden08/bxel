/* @layer core @kind logic */
import { TABLE_SIZE } from './remap-cel.constants';

const remapCel = (pixels: Uint8Array, table: Uint8Array): Uint8Array => {
  const full = new Uint8Array(TABLE_SIZE);
  full.set(table.subarray(0, TABLE_SIZE));
  const out = new Uint8Array(pixels.length);
  for (let at = 0; at < pixels.length; at += 1) out[at] = full[pixels[at] ?? 0] ?? 0;
  return out;
};

export { remapCel };
