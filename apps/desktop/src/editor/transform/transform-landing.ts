/* @layer renderer-app @kind logic */
import { combineMasks, emptyMask } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { clipMask } from '../clip-mask';
import type { EditorTarget } from '../editor.type';
import { regionBox } from '../pending/region-box';
import { insideQuad } from './inside-quad';
import { specQuad } from './spec-quad';
import type { TransformSpec } from './transform.type';

const transformLanding = (target: EditorTarget, mask: MaskView | null, spec: TransformSpec): MaskView | null => {
  const quad = specQuad(regionBox(target, mask), spec);
  const shape = emptyMask(target.sprite);
  const left = Math.max(0, Math.floor(Math.min(...quad.map((corner) => corner.x))));
  const right = Math.min(shape.width - 1, Math.ceil(Math.max(...quad.map((corner) => corner.x))));
  const top = Math.max(0, Math.floor(Math.min(...quad.map((corner) => corner.y))));
  const bottom = Math.min(shape.height - 1, Math.ceil(Math.max(...quad.map((corner) => corner.y))));
  for (let y = top; y <= bottom; y++) {
    for (let x = left; x <= right; x++) {
      if (insideQuad(quad, { x: x + 0.5, y: y + 0.5 })) shape.bits[y * shape.width + x] = 1;
    }
  }
  const limit = clipMask(target);
  return limit ? combineMasks(shape, limit, 'intersect') : shape;
};

export { transformLanding };
