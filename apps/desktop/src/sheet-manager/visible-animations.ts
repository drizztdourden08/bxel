/* @layer renderer-app @kind logic */
import { filterAnimations } from './filter-animations';
import { NAME_COLLATOR } from './manager.constants';
import type { AnimationFacts, ListQuery, SortKey } from './manager.type';
import { COMPARE } from './visible-animations.constants';

const sortAnimations = (animations: readonly AnimationFacts[], key: SortKey, down: boolean): AnimationFacts[] => {
  if (key === 'manual') return down ? [...animations].reverse() : [...animations];
  const sign = down ? -1 : 1;
  const compare = COMPARE[key];
  return [...animations].sort((a, b) => sign * (compare(a, b) || NAME_COLLATOR.compare(a.name, b.name)));
};

const visibleAnimations = (animations: readonly AnimationFacts[], list: ListQuery): AnimationFacts[] =>
  sortAnimations(filterAnimations(animations, list.query, list.filter), list.sortKey, list.sortDown);

export { visibleAnimations };
