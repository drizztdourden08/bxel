/* @layer renderer-app @kind logic */
import { NAME_COLLATOR } from './manager.constants';
import type { SortKey, SpriteFacts } from './manager.type';
import { FACT_COMPARE } from './sort-facts.constants';

const ordered = (facts: readonly SpriteFacts[], key: Exclude<SortKey, 'manual'>, sign: number): SpriteFacts[] => {
  const compare = FACT_COMPARE[key];
  return [...facts].sort((a, b) => sign * (compare(a, b) || NAME_COLLATOR.compare(a.sprite.name, b.sprite.name)));
};

const sortFacts = (facts: readonly SpriteFacts[], key: SortKey, down: boolean): SpriteFacts[] => {
  if (key === 'manual') return down ? [...facts].reverse() : [...facts];
  const sign = down ? -1 : 1;
  if (key !== 'created') return ordered(facts, key, sign);
  const known = facts.filter((fact) => fact.sprite.created !== undefined);
  const unknown = facts.filter((fact) => fact.sprite.created === undefined);
  return [...ordered(known, key, sign), ...[...unknown].sort((a, b) => NAME_COLLATOR.compare(a.sprite.name, b.sprite.name))];
};

export { sortFacts };
