/* @layer core @kind logic */
import type { Draft } from '../../draft/draft.type';
import type { LayerId } from '../../model/ids.type';
import type { CommandInput } from '../command-def.type';
import { registerCreatedRef } from '../register-created-ref';

const registerLayerRef = (draft: Draft, input: CommandInput, created: readonly LayerId[]): void => {
  registerCreatedRef(draft, input, created, 'layer');
};

export { registerLayerRef };
