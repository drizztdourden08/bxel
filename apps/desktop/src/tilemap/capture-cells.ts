/* @layer renderer-app @kind logic */
import { NO_FLAGS } from '@bxel/document';
import type { CellFlags, Rect } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { readCell } from './read-cell';
import type { CellRead, MapTarget } from './tilemap.type';

const readRect = (target: MapTarget, rect: Rect): (CellRead | null)[] => {
  const reads: (CellRead | null)[] = [];
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    for (let x = rect.x; x < rect.x + rect.width; x += 1) reads.push(readCell(target.tilemap, target.layer, { x, y }));
  }
  return reads;
};

const captureCells = (rect: Rect): boolean => {
  const target = currentMap();
  if (!target) return false;
  const reads = readRect(target, rect);
  const keys = reads.map((read) => read?.key ?? 0);
  if (keys.every((key) => key === 0)) return false;
  const first: CellFlags = reads.find((read) => read !== null && read.key !== 0)?.flags ?? NO_FLAGS;
  const store = useTilemapStore.getState();
  store.setStamp({ columns: rect.width, rows: rect.height, keys });
  store.setFlags(keys.length === 1 ? first : NO_FLAGS);
  return true;
};

export { captureCells };
