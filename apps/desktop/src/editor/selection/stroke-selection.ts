/* @layer renderer-app @kind logic */
import { ADVANCED_COMMAND } from '@bxel/raster';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { useToolStore } from '../../stores/useToolStore';
import { currentTarget } from '../current-target';
import { runSelectionStep } from './run-selection-step';
import { SELECTION_LABELS, SELECTION_TEXT } from './selection.constants';
import { selectionMask } from './selection-mask';

const strokeSelection = (side: 'inside' | 'outside'): boolean => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  if (!mask) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingSelected);
    return false;
  }
  const { foreground, connectivity } = useToolStore.getState();
  return runSelectionStep(SELECTION_LABELS.stroke, { name: ADVANCED_COMMAND.pixelsOutline, options: { of: 'selection', mask, side, ring: connectivity, index: foreground } });
};

export { strokeSelection };
