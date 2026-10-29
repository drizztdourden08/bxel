/* @layer renderer-app @kind logic */
import { ADVANCED_COMMAND, maskBounds } from '@bxel/raster';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { currentTarget } from '../current-target';
import { shiftMask } from '../pending/shift-mask';
import type { AlignEdge } from './align-edge.type';
import { alignOffset } from './align-offset';
import { commitSelection } from './commit-selection';
import { runSelectionStep } from './run-selection-step';
import { SELECTION_LABELS, SELECTION_TEXT } from './selection.constants';
import { selectionMask } from './selection-mask';

const alignSelection = (edge: AlignEdge): boolean => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  const box = mask ? maskBounds(mask) : null;
  if (!target || !mask || !box) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingToAlign);
    return false;
  }
  const offset = alignOffset(edge, box, target.sprite);
  if (offset.x === 0 && offset.y === 0) return true;
  const moved = runSelectionStep(SELECTION_LABELS.align, { name: ADVANCED_COMMAND.pixelsMove, options: { offset, skipZero: false, mask } });
  if (moved) commitSelection(target, shiftMask(mask, offset));
  return moved;
};

export { alignSelection };
