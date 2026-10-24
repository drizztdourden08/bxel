/* @layer renderer-app @kind logic */
import { NAME_COLLATOR } from './manager.constants';
import type { SortKey, SpriteFacts } from './manager.type';
import { FACT_COMPARE } from './sort-facts.constants';

const sortFacts = (facts: readonly SpriteFacts[], key: SortKey, down: boolean): SpriteFacts[] => {
  if (key === 'manual') return down ? [...facts].reverse() : [...facts];
  const compare = FACT_COMPARE[key];
  const sign = down ? -1 : 1;
  return [...facts].sort((a, b) => sign * (compare(a, b) || NAME_COLLATOR.compare(a.sprite.name, b.sprite.name)));
};

export { sortFacts };
