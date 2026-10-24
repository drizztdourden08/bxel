/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { ManagerFilter, SpriteFacts } from './manager.type';
import { nameMatches } from './name-matches';
import { sizeKey } from './size-key';

const filterFacts = (facts: readonly SpriteFacts[], query: string, filter: ManagerFilter, twins: ReadonlySet<SpriteId>): SpriteFacts[] =>
  facts.filter(
    (fact) =>
      nameMatches(fact.sprite.name, query) &&
      (!filter.animated || fact.frames > 1) &&
      (!filter.unplaced || !fact.onSheet) &&
      (filter.size === null || sizeKey(fact.sprite) === filter.size) &&
      (filter.identical === 'off' || twins.has(fact.sprite.id)),
  );

export { filterFacts };
