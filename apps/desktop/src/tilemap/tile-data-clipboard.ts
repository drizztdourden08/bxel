/* @layer renderer-app @kind logic */
import { tileShapes } from '@bxel/document';
import type { Tile } from '@bxel/document';
import { useNoticeStore } from '../stores/useNoticeStore';
import { useTilesetViewStore } from '../stores/useTilesetViewStore';
import { currentTileset } from './current-tileset';
import { pickedKey } from './picked-key';
import { selectCells } from './select-cells';
import { setShapes } from './set-shapes';
import { setTileData } from './set-tile-data';
import type { TileDataPatch } from './set-tile-data.type';
import { TILE_LABEL } from './tilemap.constants';

let held: TileDataPatch | null = null;

const tileOf = (key: number | undefined): Tile | null => {
  const wanted = key ?? pickedKey();
  return currentTileset()?.tiles.find((each) => each.key === wanted) ?? null;
};

const findOnMap = (key?: number): boolean => {
  const tile = tileOf(key);
  return tile === null ? false : selectCells({ by: 'tile', key: tile.key }, 'replace');
};

const copyCollision = (key?: number): boolean => {
  const tile = tileOf(key);
  if (tile === null) return false;
  useTilesetViewStore.getState().setShapeClipboard(tileShapes(tile));
  useNoticeStore.getState().post(TILE_LABEL.copiedCollision);
  return true;
};

const pasteCollision = (key?: number): boolean => {
  const tile = tileOf(key);
  const shapes = useTilesetViewStore.getState().shapeClipboard;
  return tile === null || shapes.length === 0 ? false : setShapes([tile.key], shapes, 'set');
};

const copyData = (key?: number): boolean => {
  const tile = tileOf(key);
  if (tile === null) return false;
  held = { type: tile.type ?? null, probability: tile.probability ?? null, turns: tile.turns ?? null, data: tile.data ?? {} };
  useNoticeStore.getState().post(TILE_LABEL.copiedData);
  return true;
};

const pasteData = (key?: number): boolean => {
  const tile = tileOf(key);
  return tile === null || held === null ? false : setTileData([tile.key], held, TILE_LABEL.pasteData);
};

const hasCollisionToPaste = (): boolean => useTilesetViewStore.getState().shapeClipboard.length > 0;

const hasDataToPaste = (): boolean => held !== null;

export { copyCollision, copyData, findOnMap, hasCollisionToPaste, hasDataToPaste, pasteCollision, pasteData };
