/* @layer renderer-app @kind logic */
import type { ManagerFilter, SpriteFacts } from './manager.type';
import { nameMatches } from './name-matches';
import { sizeKey } from './size-key';

const filterFacts = (facts: readonly SpriteFacts[], query: string, filter: ManagerFilter): SpriteFacts[] =>
  facts.filter(
    (fact) =>
      nameMatches(fact.sprite.name, query) &&
      (!filter.animated || fact.frames > 1) &&
      (!filter.unplaced || !fact.onSheet) &&
      (filter.size === null || sizeKey(fact.sprite) === filter.size),
  );

export { filterFacts };
