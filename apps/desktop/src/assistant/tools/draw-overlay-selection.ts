/* @layer renderer-app @kind logic */
import type { MaskView } from '@bxel/raster';
import { blendOverlayPixel } from './blend-overlay-pixel';
import { GRID_INK } from './render-overlay.constants';
import type { OverlayCanvas } from './render-overlay.type';

const selected = (mask: MaskView, x: number, y: number): boolean =>
  x >= 0 && y >= 0 && x < mask.width && y < mask.height && (mask.bits[y * mask.width + x] ?? 0) !== 0;

const drawEdge = ({ image, scale }: OverlayCanvas, cell: { readonly x: number; readonly y: number }, side: 'left' | 'right' | 'top' | 'bottom'): void => {
  const left = cell.x * scale;
  const top = cell.y * scale;
  for (let step = 0; step < scale; step += 1) {
    const at = {
      left: { x: left, y: top + step },
      right: { x: left + scale - 1, y: top + step },
      top: { x: left + step, y: top },
      bottom: { x: left + step, y: top + scale - 1 },
    }[side];
    blendOverlayPixel(image, at, GRID_INK.selection);
  }
};

const drawOverlaySelection = (canvas: OverlayCanvas, mask: MaskView): void => {
  for (let y = 0; y < mask.height; y += 1) {
    for (let x = 0; x < mask.width; x += 1) {
      if (!selected(mask, x, y)) continue;
      if (!selected(mask, x - 1, y)) drawEdge(canvas, { x, y }, 'left');
      if (!selected(mask, x + 1, y)) drawEdge(canvas, { x, y }, 'right');
      if (!selected(mask, x, y - 1)) drawEdge(canvas, { x, y }, 'top');
      if (!selected(mask, x, y + 1)) drawEdge(canvas, { x, y }, 'bottom');
    }
  }
};

export { drawOverlaySelection };
