/* @layer renderer-app @kind logic */
import type { CommandDef } from '@drizztdourden08/brock-react';
import { ALL_RULES } from '../ui-context/all-rules.constants';
import { hasRule } from '../ui-context/has-rule';
import { uiReason } from '../ui-context/ui-reason';
import { uiState } from '../ui-context/ui-state';

const onlyOf = (id: string): string | undefined => (hasRule(id) ? ALL_RULES[id]?.only : undefined);

const gated = (def: CommandDef): CommandDef => {
  const own = def.when;
  const ownVisible = def.visible;
  const ownReason = def.reason;
  const only = onlyOf(def.id);
  return {
    ...def,
    ...(only === undefined ? {} : { only }),
    visible: () => uiState(def.id).state !== 'hidden' && (ownVisible?.() ?? true),
    when: () => {
      const { state } = uiState(def.id);
      if (state === 'hidden') return true;
      return state === 'shown' && (own?.() ?? true);
    },
    reason: () => uiReason(def.id) ?? ownReason?.() ?? null,
  };
};

export { gated };
