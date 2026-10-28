/* @layer renderer-app @kind logic */
import type { Artwork, Sheet, SpriteId } from '@bxel/document';
import { animationFacts, libraryAnimations } from './animation-facts';
import { allFacts, libraryFacts } from './all-facts';
import { folderGroups } from './folder-groups';
import type { FolderGroup } from './folders.type';
import type { AnimationFacts, ListQuery, SpriteFacts } from './manager.type';
import { twinIds } from './twin-ids';
import { visibleAnimations } from './visible-animations';
import { visibleFacts } from './visible-facts';
import { visibleOrder } from './visible-order';

interface ManagerLists {
  facts: SpriteFacts[];
  twins: ReadonlySet<SpriteId>;
  shown: SpriteFacts[];
  animationFacts: AnimationFacts[];
  animations: AnimationFacts[];
  groups: FolderGroup[];
  order: SpriteId[];
  library: { sprites: SpriteFacts[]; animations: AnimationFacts[] };
}

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

export type { ManagerLists };
export { managerLists };
