/* @layer renderer-app @kind logic */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { uiState } from '../ui-context/ui-state';

const gated = (def: CommandDef): CommandDef => {
  const own = def.when;
  const ownReason = def.reason;
  const reason = (): string | null => {
    const state = uiState(def.id);
    return state.state === 'disabled' ? state.reason : (ownReason?.() ?? null);
  };
  return { ...def, when: () => uiState(def.id).state === 'shown' && (own?.() ?? true), reason };
};

export { gated };
