/* @layer renderer-app @kind logic */
import { NO_FLAGS } from '@bxel/document';
import type { Rect } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { readCell } from './read-cell';

const captureCells = (rect: Rect): boolean => {
  const target = currentMap();
  if (!target) return false;
  const keys: number[] = [];
  let flags = NO_FLAGS;
  for (let y = rect.y; y < rect.y + rect.height; y += 1) {
    for (let x = rect.x; x < rect.x + rect.width; x += 1) {
      const read = readCell(target.tilemap, target.layer, { x, y });
      if (read && read.key !== 0 && keys.every((key) => key === 0)) flags = read.flags;
      keys.push(read?.key ?? 0);
    }
  }
  if (keys.every((key) => key === 0)) return false;
  const store = useTilemapStore.getState();
  store.setStamp({ columns: rect.width, rows: rect.height, keys });
  store.setFlags(keys.length === 1 ? flags : NO_FLAGS);
  return true;
};

export { captureCells };
