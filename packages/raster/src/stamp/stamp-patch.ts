/* @layer core @kind logic */
import { boundsToRect } from '../bounds-to-rect';
import { createWriter } from '../create-writer';
import type { Rect } from '../geometry.type';
import { symmetryMaps } from '../symmetry-maps';
import { writePixel } from '../write-pixel';
import { orientPatch } from './orient-patch';
import type { StampOptions } from './stamp.type';

const stampPatch = (options: StampOptions): Rect | null => {
  const writer = createWriter({ target: options.target, index: 0, mask: options.mask, wrap: options.wrap, ink: options.ink });
  const first = options.anchor ?? { x: Math.floor(options.patch.width / 2), y: Math.floor(options.patch.height / 2) };
  const { patch, anchor } = orientPatch(options.patch, first, options);
  const maps = symmetryMaps(options.symmetry ?? {}, 1);
  for (const point of options.points) {
    const left = point.x - anchor.x;
    const top = point.y - anchor.y;
    for (const [at, value] of patch.pixels.entries()) {
      if (options.skipZero && value === 0) continue;
      const cell = { x: left + (at % patch.width), y: top + Math.floor(at / patch.width) };
      for (const map of maps) {
        const to = map(cell);
        writePixel(writer, to.x, to.y, value);
      }
    }
  }
  return boundsToRect(writer.bounds);
};

export { stampPatch };
