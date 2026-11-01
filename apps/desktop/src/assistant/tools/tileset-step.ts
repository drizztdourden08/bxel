/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../stores/useTilesetViewStore';
import { APP_TOOL_TEXT } from './app-tool.constants';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const tilesetStep: ViewStep = (patch) => {
  const { tileset } = patch;
  if (!tileset) return null;
  const { stamp } = tileset;
  if (stamp !== undefined && stamp.keys.length !== stamp.columns * stamp.rows) return viewFail(APP_TOOL_TEXT.stampSize(stamp.columns, stamp.rows), 'tileset.stamp.keys');
  const panel = useTilesetViewStore.getState();
  if (tileset.mode !== undefined) panel.setMode(tileset.mode);
  if (tileset.search !== undefined) panel.setSearch(tileset.search);
  const tiles = useTilemapStore.getState();
  if (stamp !== undefined || tileset.scatter !== undefined) {
    const now = tiles.stamp;
    tiles.setStamp({ ...now, ...(stamp ?? {}), scatter: tileset.scatter ?? now.scatter });
  }
  if (tileset.terrainBrush !== undefined) tiles.setTerrainBrush(tileset.terrainBrush);
  if (tileset.collisionOverlay !== undefined) tiles.setShowCollision(tileset.collisionOverlay);
  return null;
};

export { tilesetStep };
