/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../stores/useTilemapStore';
import { blockStamp } from './block-stamp';
import { selectedMap } from './selected-map';
import { writeSystemCells } from './write-system-cells';

const copyCells = (): boolean => {
  const picked = selectedMap();
  if (!picked) return false;
  const { target, selection } = picked;
  const clip = { stamp: blockStamp(target, selection.rect, selection.mask), origin: { x: selection.rect.x, y: selection.rect.y }, tilesetId: target.tileset.id };
  useTilemapStore.getState().setClip(clip);
  void writeSystemCells(clip);
  return true;
};

export { copyCells };
