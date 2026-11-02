/* @layer renderer-app @kind logic */
import { combineMasks } from '@bxel/raster';
import type { MaskView, Point } from '@bxel/raster';
import { editMask } from './edit-mask';
import type { EditorTarget, FillChoice } from './editor.type';
import { tileCellMask } from './tile-cell-mask';

const fillMask = (target: EditorTarget, at: Point, choice: FillChoice): MaskView | null => {
  const base = editMask(target);
  if (choice.tile === undefined) return base;
  const cell = tileCellMask(target.sprite, choice.tile, at);
  return base ? combineMasks(base, cell, 'intersect') : cell;
};

export { fillMask };
