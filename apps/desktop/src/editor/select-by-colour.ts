/* @layer renderer-app @kind logic */
import { indexMask } from '@bxel/raster';
import type { ByColourArgs } from '../context-menu/menu-args.type';
import { useSelectionStore } from '../stores/useSelectionStore';
import { currentTarget } from './current-target';
import { commitSelection } from './selection/commit-selection';
import { mergeMask } from './selection/merge-mask';
import { pointMask } from './selection/point-mask';
import { samplePixels } from './selection/sample-pixels';
import { selectionMask } from './selection/selection-mask';

const selectByColour = (args: Partial<ByColourArgs>): void => {
  const target = currentTarget();
  if (!target) return;
  const { x, y } = args;
  const at = x === undefined || y === undefined ? null : { x, y };
  const { mode } = useSelectionStore.getState();
  const base = selectionMask(target);
  if (args.mode === 'region' && at) {
    commitSelection(target, mergeMask(base, pointMask(target, 'wand', at), mode));
    return;
  }
  const { width, height } = target.sprite;
  const pixels = samplePixels(target);
  const index = args.index ?? (at ? pixels[at.y * width + at.x] : undefined);
  if (index !== undefined) commitSelection(target, mergeMask(base, indexMask({ pixels, width, height }, index), mode));
};

export { selectByColour };
