/* @layer core @kind logic */
import type { BufferView } from '../buffer.type';
import type { Rect } from '../geometry.type';
import { maskAllows } from '../mask-allows';
import { neighbourAt } from './neighbour-at';
import { outlineColour } from './outline-colour';
import { RING_4, RING_8 } from './outline.constants';
import type { OutlineOptions } from './outline.type';

const touchingOf = (source: BufferView, x: number, y: number, options: OutlineOptions): number | null => {
  const wanted = options.side === 'outside';
  for (const [dx, dy] of options.ring === 4 ? RING_4 : RING_8) {
    const near = neighbourAt(source, x + dx, y + dy, options.wrap);
    if (wanted ? near !== 0 : near === 0) return near;
  }
  return null;
};

const outlineCel = (target: BufferView, options: OutlineOptions): Rect | null => {
  const source = { ...target, pixels: Uint8Array.from(target.pixels) };
  let x0 = target.width;
  let y0 = target.height;
  let x1 = -1;
  let y1 = -1;
  for (let y = 0; y < target.height; y++) {
    for (let x = 0; x < target.width; x++) {
      const own = source.pixels[y * target.width + x] ?? 0;
      if ((options.side === 'outside') !== (own === 0) || !maskAllows(options.mask, x, y)) continue;
      const touching = touchingOf(source, x, y, options);
      const colour = touching === null ? null : outlineColour(options, own, touching);
      if (colour === null || colour === own) continue;
      target.pixels[y * target.width + x] = colour;
      x0 = Math.min(x0, x);
      y0 = Math.min(y0, y);
      x1 = Math.max(x1, x);
      y1 = Math.max(y1, y);
    }
  }
  return x1 < 0 ? null : { x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
};

export { outlineCel };
