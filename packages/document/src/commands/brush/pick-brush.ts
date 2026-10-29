/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { SavedBrush } from '../../model/brush.type';
import type { BrushId } from '../../model/ids.type';
import type { EntityRef } from '../../schema/entity-ref.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { resolveRefId } from '../tilemap/resolve-ref-id';

const pickBrush = (draft: Draft, ref: EntityRef<BrushId>): SavedBrush => {
  const id = resolveRefId(draft, ref, 'options.brush');
  const found = (draft.artwork.brushes ?? []).find((brush) => brush.id === id);
  if (!found) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Brush ${id} does not exist.`, { path: 'options.brush' });
  return found;
};

export { pickBrush };
