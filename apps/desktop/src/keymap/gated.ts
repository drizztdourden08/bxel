/* @layer renderer-app @kind logic */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { uiState } from '../ui-context/ui-state';

const gated = (def: CommandDef): CommandDef => {
  const own = def.when;
  return { ...def, when: () => uiState(def.id).state === 'shown' && (own?.() ?? true) };
};

export { gated };
