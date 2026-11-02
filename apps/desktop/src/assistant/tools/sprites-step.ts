/* @layer renderer-app @kind logic */
import { useManagerStore } from '../../stores/useManagerStore';
import type { ManagerFilter } from '../../sheet-manager/manager.type';
import type { SpritesPatch } from './sprites-step.type';
import type { ViewStep } from './view-steps.type';

const withoutUndefined = (filter: NonNullable<SpritesPatch['filter']>): Partial<ManagerFilter> =>
  Object.fromEntries(Object.entries(filter).filter(([, value]) => value !== undefined));

const spritesStep: ViewStep = (patch) => {
  const { sprites } = patch;
  if (!sprites) return null;
  const store = useManagerStore.getState();
  if (sprites.query !== undefined) store.patch({ query: sprites.query });
  if (sprites.filter !== undefined) store.patchFilter(withoutUndefined(sprites.filter));
  if (sprites.sort !== undefined) store.patch({ sortKey: sprites.sort.key, sortDown: sprites.sort.descending });
  if (sprites.view !== undefined) store.patch({ view: sprites.view });
  if (sprites.size !== undefined) store.patch({ zoom: sprites.size });
  if (sprites.collapsed !== undefined) store.patch({ collapsed: sprites.collapsed });
  return null;
};

export { spritesStep };
