/* @layer renderer-app @kind logic */
import type { Artwork, Sheet } from '@bxel/document';
import { allFacts } from './all-facts';
import { animationFacts } from './animation-facts';
import { folderGroups } from './folder-groups';
import { libraryAnimations } from './library-animations';
import { libraryFacts } from './library-facts';
import type { ListQuery } from './manager.type';
import type { ManagerLists } from './manager-lists.type';
import { twinIds } from './twin-ids';
import { visibleAnimations } from './visible-animations';
import { visibleFacts } from './visible-facts';
import { visibleOrder } from './visible-order';

const managerLists = (artwork: Artwork, sheet: Sheet | null, list: Omit<ListQuery, 'twins'>, collapsed: ReadonlySet<string>): ManagerLists => {
  const facts = allFacts(artwork, sheet);
  const twins = twinIds(facts, list.filter.identical);
  const shown = visibleFacts(facts, { ...list, twins });
  const every = animationFacts(artwork, sheet);
  const groups = folderGroups(shown, collapsed, list.sortKey === 'manual');
  return {
    facts,
    twins,
    shown,
    animationFacts: every,
    animations: visibleAnimations(every, list),
    groups,
    order: visibleOrder(groups),
    library: { sprites: libraryFacts(artwork, sheet), animations: libraryAnimations(artwork, sheet) },
  };
};

export { managerLists };
