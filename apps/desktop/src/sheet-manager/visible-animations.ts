/* @layer renderer-app @kind logic */
import { filterAnimations } from './filter-facts';
import { NAME_COLLATOR } from './manager.constants';
import type { AnimationFacts, ListQuery, SortKey } from './manager.type';

const area = (fact: AnimationFacts): number => fact.animation.width * fact.animation.height;

const COMPARE: Readonly<Record<Exclude<SortKey, 'manual'>, (a: AnimationFacts, b: AnimationFacts) => number>> = {
  name: (a, b) => NAME_COLLATOR.compare(a.name, b.name),
  size: (a, b) => a.animation.width - b.animation.width || a.animation.height - b.animation.height,
  area: (a, b) => area(a) - area(b),
  bank: (a, b) => NAME_COLLATOR.compare(a.bank, b.bank),
  created: (a, b) => (a.animation.created ?? 0) - (b.animation.created ?? 0),
};

const sortAnimations = (animations: readonly AnimationFacts[], key: SortKey, down: boolean): AnimationFacts[] => {
  if (key === 'manual') return down ? [...animations].reverse() : [...animations];
  const sign = down ? -1 : 1;
  const compare = COMPARE[key];
  return [...animations].sort((a, b) => sign * (compare(a, b) || NAME_COLLATOR.compare(a.name, b.name)));
};

const visibleAnimations = (animations: readonly AnimationFacts[], list: ListQuery): AnimationFacts[] =>
  sortAnimations(filterAnimations(animations, list.query, list.filter), list.sortKey, list.sortDown);

export { visibleAnimations };
