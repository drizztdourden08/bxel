/* @layer renderer-app @kind logic */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { uiReason } from '../ui-context/ui-reason';
import { uiState } from '../ui-context/ui-state';

const gated = (def: CommandDef): CommandDef => {
  const own = def.when;
  const ownReason = def.reason;
  return {
    ...def,
    when: () => uiState(def.id).state === 'shown' && (own?.() ?? true),
    reason: () => uiReason(def.id) ?? ownReason?.() ?? null,
  };
};

export { gated };
