/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { runDocument } from '../../sheet/run-document';
import { spritesTarget } from '../../sheet/sprites-target';
import { useNoticeStore } from '../../stores/useNoticeStore';
import { currentTarget } from '../current-target';
import { SELECTION_LABELS, SELECTION_TEXT } from './selection.constants';
import { selectionBounds } from './selection-bounds';

const selectionToGuides = (): boolean => {
  const target = currentTarget();
  const box = target ? selectionBounds(target) : null;
  if (!target || !box) {
    useNoticeStore.getState().post(SELECTION_TEXT.nothingSelected);
    return false;
  }
  const scope = spritesTarget([target.sprite.id]);
  const line = (axis: 'x' | 'y', position: number): CommandStep => ({ name: COMMAND_NAME.guideAdd, targets: scope, options: { axis, position } });
  const steps = [line('x', box.x), line('x', box.x + box.width), line('y', box.y), line('y', box.y + box.height)];
  return runDocument(SELECTION_LABELS.guides, steps) !== null;
};

export { selectionToGuides };
