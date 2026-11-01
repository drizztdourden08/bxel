/* @layer renderer-app @kind logic */
import { ALL_RULES } from './all-rules.constants';
import { hasRule } from './has-rule';

const uiOnly = (id: string): string | null => (hasRule(id) ? (ALL_RULES[id]?.only ?? null) : null);

export { uiOnly };
