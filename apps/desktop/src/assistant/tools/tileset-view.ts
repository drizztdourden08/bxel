/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../stores/useTilesetViewStore';

const tilesetView = () => {
  const panel = useTilesetViewStore.getState();
  const tiles = useTilemapStore.getState();
  const { stamp } = tiles;
  return {
    mode: panel.mode,
    search: panel.search,
    filters: [...panel.filters],
    stamp: { columns: stamp.columns, rows: stamp.rows, keys: [...stamp.keys] },
    scatter: stamp.scatter === true,
    terrainBrush: tiles.terrainBrush,
    collisionOverlay: tiles.showCollision,
  };
};

export { tilesetView };
