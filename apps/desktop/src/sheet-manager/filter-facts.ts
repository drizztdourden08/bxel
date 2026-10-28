/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import type { AnimationFacts, ManagerFilter, SpriteFacts } from './manager.type';
import { nameMatches } from './name-matches';
import { sizeKey } from './size-key';

const flagsMatch = (fact: SpriteFacts, filter: ManagerFilter): boolean =>
  filter.kind !== 'animations' && (!filter.slices || fact.slices > 0);

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

const filterAnimations = (animations: readonly AnimationFacts[], query: string, filter: ManagerFilter): AnimationFacts[] =>
  filter.kind === 'sprites' || filter.slices || filter.identical !== 'off' || filter.tag !== null
    ? []
    : animations.filter(
        (fact) =>
          nameMatches(fact.name, query) &&
          (filter.size === null || sizeKey(fact.animation) === filter.size) &&
          (filter.bank === null || fact.animation.bankId === filter.bank),
      );

export { filterAnimations, filterFacts };
