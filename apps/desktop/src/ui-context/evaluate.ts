/* @layer renderer-app @kind logic */
import { ALL_RULES } from './all-rules.constants';
import type { BxelContext } from './bxel-context.type';
import { HIDDEN, SHOWN } from './evaluate.constants';
import { hasRule } from './has-rule';
import type { UiState } from './ui-rule.type';

const evaluate = (id: string, context: BxelContext): UiState => {
  const found = hasRule(id) ? ALL_RULES[id] : undefined;
  if (!found) return SHOWN;
  if (!found.applies(context)) return HIDDEN;
  if (found.ready && !found.ready(context)) return { state: 'disabled', reason: found.reason?.(context) ?? null };
  return SHOWN;
};

export { evaluate };
