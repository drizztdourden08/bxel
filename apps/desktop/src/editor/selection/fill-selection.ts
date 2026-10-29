/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { useToolStore } from '../../stores/useToolStore';
import { currentTarget } from '../current-target';
import { maskPatch } from './mask-patch';
import { runSelectionStep } from './run-selection-step';
import { SELECTION_LABELS, SELECTION_TEXT } from './selection.constants';
import { selectionMask } from './selection-mask';

const fillSelection = (slot: 'foreground' | 'background'): boolean => {
  const target = currentTarget();
  const mask = target ? selectionMask(target) : null;
  const patch = mask ? maskPatch(mask, useToolStore.getState()[slot]) : null;
  if (!patch) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingSelected);
    return false;
  }
  return runSelectionStep(SELECTION_LABELS.fill, { name: COMMAND_NAME.pixelsPatch, options: { rect: patch.rect, pixels: patch.pixels, skipZero: true } });
};

export { fillSelection };
