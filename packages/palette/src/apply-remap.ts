/* @layer core @kind logic */
import type { IndexBuffer } from './image.type';

const applyRemap = (buffer: IndexBuffer, table: Uint8Array): IndexBuffer => ({
  pixels: buffer.pixels.map((slot) => table[slot] ?? slot),
  width: buffer.width,
  height: buffer.height,
});

export { applyRemap };
