/* @layer core @kind logic */
import type { Draft } from '../draft/draft.type';
import { registerRef } from '../draft/register-ref';
import type { CommandInput } from './command-def.type';
import { ERROR_CODE } from './error-code.constants';
import { fail } from './fail';

const registerCreatedRef = (draft: Draft, input: CommandInput, created: readonly string[], noun: string): void => {
  const [only] = created;
  if (only === undefined || input.ref === undefined) return;
  if (created.length > 1) {
    throw fail(ERROR_CODE.INVALID_OPTION, `A ref names one ${noun}, so it needs a step with one target sprite.`, { path: 'ref' });
  }
  registerRef(draft, input.ref, only);
};

export { registerCreatedRef };
