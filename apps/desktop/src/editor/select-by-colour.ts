/* @layer renderer-app @kind logic */
import { indexMask } from '@bxel/raster';
import type { ByColourArgs } from '../context-menu/menu-args.type';
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import { celPixels } from './selection/cel-pixels';
import { pointMask } from './selection/point-mask';
import { setSelection } from './selection/set-selection';

const selectByColour = (args: Partial<ByColourArgs>): void => {
  const target = currentTarget();
  if (!target) return;
  const { x, y } = args;
  const at = x === undefined || y === undefined ? null : { x, y };
  if (args.mode === 'region' && at) {
    setSelection(target, pointMask(target, 'wand', at, useToolStore.getState().connectivity));
    return;
  }
  const { width, height } = target.sprite;
  const pixels = celPixels(target);
  const index = args.index ?? (at ? pixels[at.y * width + at.x] : undefined);
  if (index !== undefined) setSelection(target, indexMask({ pixels, width, height }, index));
};

export { selectByColour };
