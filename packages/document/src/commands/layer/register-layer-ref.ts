/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import { registerRef } from '../../draft/register-ref';
import type { LayerId } from '../../model/ids.type';
import type { CommandInput } from '../command-def.type';
import { ERROR_CODE } from '../error-code.constants';
import { fail } from '../fail';

const registerLayerRef = (draft: Draft, input: CommandInput, created: readonly LayerId[]): void => {
  const [only] = created;
  if (only === undefined || input.ref === undefined) return;
  if (created.length > 1) {
    throw fail(ERROR_CODE.INVALID_OPTION, 'A ref names one layer, so it needs a step with one target sprite.', { path: 'ref' });
  }
  registerRef(draft, input.ref, only);
};

export { registerLayerRef };
