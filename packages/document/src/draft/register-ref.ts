/* @layer core @kind logic */
import { ERROR_CODE } from '../commands/error-code.constants';
import { fail } from '../commands/fail';
import type { Draft } from './draft.type';

const registerRef = (draft: Draft, ref: string | undefined, id: string): void => {
  if (ref === undefined) return;
  if (Object.hasOwn(draft.created, ref)) {
    throw fail(ERROR_CODE.INVALID_OPTION, `The ref "${ref}" is used twice in one transaction.`, { path: 'ref' });
  }
  draft.created[ref] = id;
};

export { registerRef };
