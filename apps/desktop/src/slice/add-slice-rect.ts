/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Rect, SliceId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { freeName } from '../sheet/free-name';
import { runDocument } from '../sheet/run-document';
import { SLICE_NAME } from '../sheet/sheet.constants';
import { spritesTarget } from '../sheet/sprites-target';
import { SLICE_LABEL } from './slice.constants';

const addSliceRect = (rect: Rect): SliceId | null => {
  const target = currentTarget();
  if (!target || rect.width < 1 || rect.height < 1) return null;
  const name = freeName(SLICE_NAME, target.sprite.slices.map((slice) => slice.name));
  const step = { name: COMMAND_NAME.sliceAdd, targets: spritesTarget([target.sprite.id]), options: { name, rect }, ref: 'slice' };
  const done = runDocument(SLICE_LABEL.add, [step]);
  return (done?.created['slice'] as SliceId | undefined) ?? null;
};

export { addSliceRect };
