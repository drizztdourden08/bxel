/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { EntityRef } from '../../schema/entity-ref.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const resolveRefId = <T extends string>(draft: Draft, ref: EntityRef<T>, path: string): T => {
  if (typeof ref === 'string') return ref;
  const id = draft.created[ref.ref];
  if (id === undefined) {
    throw fail(ERROR_CODE.TARGET_NOT_FOUND, `The ref "${ref.ref}" was not created by an earlier step.`, { path });
  }
  return id as T;
};

export { resolveRefId };
