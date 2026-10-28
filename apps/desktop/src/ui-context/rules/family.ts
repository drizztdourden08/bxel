/* @layer renderer-app @kind logic */
import { rule } from '../rule';
import type { Need, Pred } from '../ui-rule.type';
import type { RuleTable } from './rule-table.type';

const family = (ids: readonly string[], applies: Pred, needs: readonly Need[] = [], only?: string): RuleTable =>
  Object.fromEntries(ids.map((id) => [id, rule({ applies, needs, ...(only === undefined ? {} : { only }) })]));

export { family };
