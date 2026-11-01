/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { SliceId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import { alignPlan } from '../sheet-manager/align-plan';
import { MIN_DISTRIBUTE } from '../sheet-manager/align.constants';
import { useNoticeStore } from '../stores/useNoticeStore';
import { SLICE_LABEL } from './slice.constants';

const distributeSlices = (axis: 'horizontal' | 'vertical'): boolean => {
  const target = currentTarget();
  const slices = target?.sprite.slices ?? [];
  if (!target || slices.length < MIN_DISTRIBUTE) {
    useNoticeStore.getState().post(SLICE_LABEL.needThree);
    return false;
  }
  const boxes = slices.map((slice) => ({ id: slice.id, ...slice.rect }));
  const moves = alignPlan<SliceId>(boxes, axis);
  if (moves.length === 0) return true;
  const steps = moves.flatMap((move) => {
    const slice = slices.find((each) => each.id === move.id);
    if (!slice) return [];
    const rect = { ...slice.rect, x: move.at.x, y: move.at.y };
    return [{ name: COMMAND_NAME.sliceUpdate, targets: spritesTarget([target.sprite.id]), options: { slice: { by: 'id', id: move.id }, rect } }];
  });
  return runDocument(SLICE_LABEL.distribute, steps) !== null;
};

export { distributeSlices };
