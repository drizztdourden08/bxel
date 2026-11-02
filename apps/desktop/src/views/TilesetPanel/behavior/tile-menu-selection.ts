/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../../../stores/useTilemapStore';
import { TILE_MENU } from '../TilesetPanel.constants';

const tileMenuSelection = ({ target }: { target: Element }): readonly string[] => {
  const key = target.closest<HTMLElement>(TILE_MENU.tile)?.dataset.tileKey;
  if (key === undefined) return [];
  const held = useTilemapStore.getState().stamp.keys.filter((each) => each !== 0);
  return held.length > 1 && held.includes(Number(key)) ? held.map(String) : [key];
};

export { tileMenuSelection };
