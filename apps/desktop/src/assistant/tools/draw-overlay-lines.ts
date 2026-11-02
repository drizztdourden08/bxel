/* @layer renderer-app @kind logic */
import type { RgbaImage } from '@bxel/formats';
import { blendOverlayPixel } from './blend-overlay-pixel';
import type { LineSet } from './render-overlay.type';

const drawOverlayLines = (image: RgbaImage, set: LineSet): void => {
  for (const x of set.columns) {
    for (let y = 0; y < image.height; y += 1) blendOverlayPixel(image, { x, y }, set.ink);
  }
  for (const y of set.rows) {
    for (let x = 0; x < image.width; x += 1) blendOverlayPixel(image, { x, y }, set.ink);
  }
};

export { drawOverlayLines };
