/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { PatternId } from '../../model/ids.type';
import type { SavedPattern } from '../../model/pattern.type';
import type { EntityRef } from '../../schema/entity-ref.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';
import { resolveRefId } from '../tilemap/resolve-ref-id';

const pickPattern = (draft: Draft, ref: EntityRef<PatternId>): SavedPattern => {
  const id = resolveRefId(draft, ref, 'options.pattern');
  const found = (draft.artwork.patterns ?? []).find((pattern) => pattern.id === id);
  if (!found) throw fail(ERROR_CODE.TARGET_NOT_FOUND, `Pattern ${id} does not exist.`, { path: 'options.pattern' });
  return found;
};

export { pickPattern };
