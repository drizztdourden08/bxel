/* @layer core @kind logic */
import type { Size } from '../geometry.type';
import { maskSource } from './mask-source';
import { ANCHOR_HALVES } from './region.constants';
import type { Mover, ScaleSpec } from './region.type';
import { scaleSize } from './scale-size';

const pick = (cell: number, from: number, extent: { readonly source: number; readonly target: number }): number =>
  from + Math.floor(((2 * cell + 1) * extent.source) / (2 * extent.target));

const insideSize = (u: number, v: number, size: Size): boolean => u >= 0 && v >= 0 && u < size.width && v < size.height;

const scaleMover =
  ({ target, anchor }: ScaleSpec): Mover =>
  ({ mask, box }) => {
    const size = scaleSize(target, box);
    const halves = ANCHOR_HALVES[anchor];
    const left = box.x + Math.floor(((box.width - size.width) * halves.x) / 2);
    const top = box.y + Math.floor(((box.height - size.height) * halves.y) / 2);
    return {
      area: { x: left, y: top, width: size.width, height: size.height },
      source: (x, y) =>
        insideSize(x - left, y - top, size)
          ? maskSource(
              mask,
              pick(x - left, box.x, { source: box.width, target: size.width }),
              pick(y - top, box.y, { source: box.height, target: size.height }),
            )
          : -1,
    };
  };

export { scaleMover };
