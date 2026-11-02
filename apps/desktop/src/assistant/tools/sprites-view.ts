/* @layer renderer-app @kind logic */
import { boundSheetId } from '../../sheet-manager/bound-sheet';
import { useManagerStore } from '../../stores/useManagerStore';
import { useSpriteStore } from '../../stores/useSpriteStore';

const spritesView = () => {
  const manager = useManagerStore.getState();
  const sprites = useSpriteStore.getState();
  return {
    selected: sprites.selected,
    scope: sprites.spritesScope,
    query: manager.query,
    filter: { ...manager.filter },
    sort: { key: manager.sortKey, descending: manager.sortDown },
    view: manager.view,
    size: manager.zoom,
    collapsed: [...manager.collapsed],
    selections: manager.selections.map((each) => ({ name: each.name, count: each.ids.length })),
    sheetId: boundSheetId(),
  };
};

export { spritesView };
