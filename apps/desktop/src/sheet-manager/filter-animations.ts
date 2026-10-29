/* @layer renderer-app @kind logic */
import type { AnimationFacts, ManagerFilter } from './manager.type';
import { nameMatches } from './name-matches';
import { sizeKey } from './size-key';

const filterAnimations = (animations: readonly AnimationFacts[], query: string, filter: ManagerFilter): AnimationFacts[] =>
  filter.kind === 'sprites' || filter.slices || filter.identical !== 'off' || filter.tag !== null
    ? []
    : animations.filter(
        (fact) =>
          nameMatches(fact.name, query) &&
          (filter.size === null || sizeKey(fact.animation) === filter.size) &&
          (filter.bank === null || fact.animation.bankId === filter.bank),
      );

export { filterAnimations };
