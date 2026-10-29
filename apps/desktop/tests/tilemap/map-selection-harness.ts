/* @layer renderer-app @kind test */
import type { MapSelection } from '../../src/stores/tilemap-store.type';
import { useTilemapStore } from '../../src/stores/useTilemapStore';
import { placeStampAt } from '../../src/tilemap/place-stamp-at';
import { selectionCells } from '../../src/tilemap/selection-cells';
import { mapNow, openMapFile } from './map-harness';

const FLIP_X = 0x80000000;
const FLIP_Y = 0x40000000;
const TURN = 0x20000000;

const store = () => useTilemapStore.getState();

const selectionNow = (): MapSelection => {
  const found = store().selection;
  if (!found) throw new Error('nothing is selected');
  return found;
};

const stampAt = (stamp: { columns: number; rows: number; keys: number[]; bits?: number[] }, at: { x: number; y: number }): void => {
  store().setStamp(stamp);
  placeStampAt([at]);
};

const chosen = (): string[] => {
  const found = store().selection;
  return found ? selectionCells(found, mapNow()).map((cell) => `${cell.x},${cell.y}`) : [];
};

const freshMap = (): void => {
  openMapFile();
  store().setSelectVariant('rect');
  store().setSelectMode('replace');
  store().setClip(null);
  store().setPaste(null);
};

export { chosen, FLIP_X, FLIP_Y, freshMap, selectionNow, stampAt, store, TURN };
