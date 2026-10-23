/* @layer core @kind logic */
import type { IndexBuffer } from './image.type';
import { REMAP_SIZE } from './remap-size.constants';

const countUsage = (buffers: readonly IndexBuffer[]): Uint32Array => {
  const usage = new Uint32Array(REMAP_SIZE);
  for (const { pixels } of buffers) {
    for (const slot of pixels) usage[slot] = (usage[slot] ?? 0) + 1;
  }
  return usage;
};

export { countUsage };
