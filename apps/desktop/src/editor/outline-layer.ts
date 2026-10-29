/* @layer renderer-app @kind logic */
import { ADVANCED_COMMAND } from '@bxel/raster';
import { useDrawingStore } from '../stores/useDrawingStore';
import { useToolStore } from '../stores/useToolStore';
import { currentTarget } from './current-target';
import { OUTLINE_TEXT } from './outline-layer.constants';
import { runSelectionStep } from './selection/run-selection-step';
import { selectionMask } from './selection/selection-mask';
import { wrapOf } from './wrap-of';

const outlineLayer = (side: 'outside' | 'inside'): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const { outlineRing, outlineSelOut } = useDrawingStore.getState();
  const mask = selectionMask(target);
  const options = {
    side,
    ring: outlineRing,
    selOut: outlineSelOut,
    ...(outlineSelOut ? {} : { index: useToolStore.getState().foreground }),
    wrap: wrapOf(),
    ...(mask ? { mask } : {}),
  };
  const label = side === 'outside' ? OUTLINE_TEXT.outside : OUTLINE_TEXT.inside;
  return runSelectionStep(label, { name: ADVANCED_COMMAND.pixelsOutline, options });
};

export { outlineLayer };
