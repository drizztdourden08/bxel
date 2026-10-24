/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { ManagerFilter, SpriteFacts } from './manager.type';
import { nameMatches } from './name-matches';
import { sizeKey } from './size-key';

const flagsMatch = (fact: SpriteFacts, filter: ManagerFilter): boolean =>
  (!filter.animated || fact.frames > 1) && (!filter.unplaced || !fact.onSheet);

const traitsMatch = (fact: SpriteFacts, filter: ManagerFilter): boolean =>
  (filter.size === null || sizeKey(fact.sprite) === filter.size) &&
  (filter.tag === null || fact.sprite.tags.some((tag) => tag.name === filter.tag)) &&
  (filter.bank === null || fact.sprite.bankId === filter.bank);

const filterFacts = (facts: readonly SpriteFacts[], query: string, filter: ManagerFilter, twins: ReadonlySet<SpriteId>): SpriteFacts[] =>
  facts.filter(
    (fact) =>
      nameMatches(fact.sprite.name, query) &&
      flagsMatch(fact, filter) &&
      traitsMatch(fact, filter) &&
      (filter.identical === 'off' || twins.has(fact.sprite.id)),
  );

export { filterFacts };
