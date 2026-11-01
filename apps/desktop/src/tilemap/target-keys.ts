/* @layer renderer-app @kind logic */
import type { Tile } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';

const targetKeys = (tile: Tile): readonly number[] => {
  const held = useTilemapStore.getState().stamp.keys.filter((key) => key !== 0);
  return held.length > 1 && held.includes(tile.key) ? held : [tile.key];
};

export { targetKeys };
