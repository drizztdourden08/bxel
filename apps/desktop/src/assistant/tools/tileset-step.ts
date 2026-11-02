/* @layer renderer-app @kind logic */
import type { CellFlags } from '@bxel/document';
import { useTilemapStore } from '../../stores/useTilemapStore';
import { useTilesetViewStore } from '../../stores/useTilesetViewStore';
import { APP_TOOL_TEXT } from './app-tool.constants';
import type { TilesetPatch } from './tileset-step.type';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const applyStamp = (tiles: ReturnType<typeof useTilemapStore.getState>, tileset: TilesetPatch): void => {
  const { stamp } = tileset;
  if (stamp === undefined && tileset.scatter === undefined) return;
  const now = tiles.stamp;
  tiles.setStamp({ ...now, ...(stamp ?? {}), scatter: tileset.scatter ?? now.scatter });
};

const definedFlags = (flags: NonNullable<TilesetPatch['flags']>): Partial<CellFlags> =>
  Object.fromEntries(Object.entries(flags).filter(([, value]) => value !== undefined));

const applyPanel = (tileset: TilesetPatch): void => {
  const panel = useTilesetViewStore.getState();
  if (tileset.mode !== undefined) panel.setMode(tileset.mode);
  if (tileset.search !== undefined) panel.setSearch(tileset.search);
  if (tileset.zoom !== undefined) panel.setZoom(tileset.zoom);
  if (tileset.showKeys !== undefined) panel.setShowKeys(tileset.showKeys);
  if (tileset.showUses !== undefined) panel.setShowUses(tileset.showUses);
  if (tileset.terrainSet !== undefined) panel.setTerrainSetId(tileset.terrainSet);
};

const applyBrush = (tileset: TilesetPatch): void => {
  const tiles = useTilemapStore.getState();
  applyStamp(tiles, tileset);
  if (tileset.terrainBrush !== undefined) tiles.setTerrainBrush(tileset.terrainBrush);
  if (tileset.collisionOverlay !== undefined) tiles.setShowCollision(tileset.collisionOverlay);
  if (tileset.flags !== undefined) tiles.setFlags({ ...tiles.flags, ...definedFlags(tileset.flags) });
  if (tileset.animate !== undefined) tiles.setAnimateTiles(tileset.animate);
};

const tilesetStep: ViewStep = (patch) => {
  const { tileset } = patch;
  if (!tileset) return null;
  const { stamp } = tileset;
  if (stamp !== undefined && stamp.keys.length !== stamp.columns * stamp.rows) return viewFail(APP_TOOL_TEXT.stampSize(stamp.columns, stamp.rows), 'tileset.stamp.keys');
  applyPanel(tileset);
  applyBrush(tileset);
  return null;
};

export { tilesetStep };
