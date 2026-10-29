/* @layer renderer-app @kind logic */
import { ALL_RULES } from './all-rules.constants';
import { hasRule } from './has-rule';
import { onlyReason, REASON } from './reasons.constants';
import { uiState } from './ui-state';

const hiddenReason = (id: string): string => {
  const only = hasRule(id) ? ALL_RULES[id]?.only : undefined;
  return only === undefined ? REASON.notHere : onlyReason(only);
};

const uiReason = (id: string): string | null => {
  const found = uiState(id);
  if (found.state === 'disabled') return found.reason;
  return found.state === 'hidden' ? hiddenReason(id) : null;
};

export { uiReason };
