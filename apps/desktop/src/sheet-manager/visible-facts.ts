/* @layer renderer-app @kind logic */
import { filterFacts } from './filter-facts';
import type { ListQuery, SpriteFacts } from './manager.type';
import { sortFacts } from './sort-facts';

const visibleFacts = (facts: readonly SpriteFacts[], list: ListQuery): SpriteFacts[] =>
  sortFacts(filterFacts(facts, list.query, list.filter), list.sortKey, list.sortDown);

export { visibleFacts };
