/* @layer core @kind logic */
import type { ResampleAlgorithm, ResampleOptions } from '../resample/resample.type';
import { ANCHOR_HALVES } from './region.constants';
import type { Mover, ScaleSpec } from './region.type';
import { resampledMover } from './resampled-mover';
import { scaleSize } from './scale-size';

const along = (cell: number, from: number, extent: { readonly source: number; readonly target: number }): number =>
  from + ((2 * cell + 1) * extent.source) / (2 * extent.target);

const scaleMover = ({ target, anchor }: ScaleSpec, algorithm: ResampleAlgorithm = 'nearest', options: ResampleOptions = {}): Mover =>
  resampledMover({
    algorithm,
    options,
    scale: ({ box }, geometry) => Math.max(geometry.area.width / box.width, geometry.area.height / box.height),
    geometry: ({ box }) => {
      const size = scaleSize(target, box);
      const halves = ANCHOR_HALVES[anchor];
      const left = box.x + Math.floor(((box.width - size.width) * halves.x) / 2);
      const top = box.y + Math.floor(((box.height - size.height) * halves.y) / 2);
      return {
        area: { x: left, y: top, width: size.width, height: size.height },
        inverse: (x, y) => ({
          x: along(x - left, box.x, { source: box.width, target: size.width }),
          y: along(y - top, box.y, { source: box.height, target: size.height }),
        }),
      };
    },
  });

export { scaleMover };
