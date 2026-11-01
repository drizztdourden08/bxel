/* @layer core @kind logic */
import type { Artwork } from '@bxel/document';
import type { Brush } from '../brush.type';
import { stampOffset } from '../stamp-offset';
import { savedBrushPatch } from './saved-brush-patch';

/** Turns a custom tip into a stencil of the pixels its saved brush draws, so every brush tool can use it. Other tips pass through. */
const resolveBrush = (artwork: Artwork, brush: Brush): Brush => {
  if (brush.shape !== 'custom') return brush;
  const patch = savedBrushPatch(artwork, brush.brushId ?? '');
  const size = Math.max(patch.width, patch.height);
  const cells = new Uint8Array(size * size);
  for (let row = 0; row < patch.height; row += 1) {
    for (let col = 0; col < patch.width; col += 1) cells[row * size + col] = (patch.pixels[row * patch.width + col] ?? 0) === 0 ? 0 : 1;
  }
  return { ...brush, size, stencil: { size, offset: stampOffset(size), cells } };
};

export { resolveBrush };
