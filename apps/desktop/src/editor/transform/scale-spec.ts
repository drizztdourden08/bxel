/* @layer renderer-app @kind logic */
import type { BoundsPolicy, ResampleAlgorithm } from '@bxel/raster';
import { currentTarget } from '../current-target';
import { editMask } from '../edit-mask';
import { regionBox } from '../pending/region-box';
import { IDENTITY } from './transform.constants';
import type { TransformSpec } from './transform.type';

const scaleSpec = (width: number, height: number, bounds: BoundsPolicy, algorithm: ResampleAlgorithm = 'nearest'): TransformSpec => {
  const target = currentTarget();
  const box = target ? regionBox(target, editMask(target)) : { x: 0, y: 0, width, height };
  return { ...IDENTITY, scale: { x: width / Math.max(1, box.width), y: height / Math.max(1, box.height) }, bounds, algorithm };
};

export { scaleSpec };
