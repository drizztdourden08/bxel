/* @layer renderer-app @kind logic */
import { combineMasks } from '@bxel/raster';
import type { MaskView } from '@bxel/raster';
import { clipMask } from './clip-mask';
import type { EditorTarget } from './editor.type';
import { selectionMask } from './selection/selection-mask';

const editMask = (target: EditorTarget): MaskView | null => {
  const selected = selectionMask(target);
  const clip = clipMask(target);
  if (!clip) return selected;
  return selected ? combineMasks(selected, clip, 'intersect') : clip;
};

export { editMask };
