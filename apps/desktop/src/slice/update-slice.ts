/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { SliceId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import { SLICE_LABEL } from './slice.constants';
import type { SliceChange } from './update-slice.type';

const updateSlice = (id: SliceId, change: SliceChange): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const step = { name: COMMAND_NAME.sliceUpdate, targets: spritesTarget([target.sprite.id]), options: { slice: { by: 'id', id }, ...change } };
  return runDocument(SLICE_LABEL.update, [step]) !== null;
};

export { updateSlice };
