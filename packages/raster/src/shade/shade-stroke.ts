/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import { createBounds } from '../create-bounds';
import type { Rect } from '../geometry.type';
import { growBounds } from '../grow-bounds';
import { paintStroke } from '../paint-stroke';
import type { ShadeStroke } from './shade.type';

const shadeStroke = ({ target, table, ...stroke }: ShadeStroke): Rect | null => {
  const touched = { pixels: new Uint8Array(target.pixels.length), width: target.width, height: target.height };
  paintStroke({ ...stroke, target: touched, index: 1 });
  const bounds = createBounds();
  for (const [at, mark] of touched.pixels.entries()) {
    const current = target.pixels[at] ?? 0;
    const shaded = table[current] ?? current;
    if (mark !== 0 && shaded !== current) {
      target.pixels[at] = shaded;
      growBounds(bounds, at % target.width, Math.floor(at / target.width));
    }
  }
  return boundsToRect(bounds);
};

export { shadeStroke };
