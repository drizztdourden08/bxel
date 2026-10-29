/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { spritesTarget } from '../sheet/sprites-target';
import { useSliceToolStore } from '../stores/useSliceToolStore';
import { selectedSlice } from './selected-slice';
import { SLICE_LABEL } from './slice.constants';

const deleteSelectedSlice = (): boolean => {
  const slice = selectedSlice();
  const target = currentTarget();
  if (!slice || !target) return false;
  const step = { name: COMMAND_NAME.sliceDelete, targets: spritesTarget([target.sprite.id]), options: { slice: { by: 'id', id: slice.id } } };
  const done = runDocument(SLICE_LABEL.remove, [step]) !== null;
  if (done) useSliceToolStore.getState().select(null);
  return done;
};

export { deleteSelectedSlice };
