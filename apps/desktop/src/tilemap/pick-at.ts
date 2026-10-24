/* @layer renderer-app @kind logic */
import type { Point } from '@bxel/document';
import { useTilemapStore } from '../stores/useTilemapStore';
import { currentMap } from './current-map';
import { readCell } from './read-cell';

const pickAt = (at: Point): boolean => {
  const target = currentMap();
  if (!target) return false;
  const layers = [target.layer, ...target.tilemap.layers.filter((each) => each !== target.layer && each.visible).reverse()];
  const found = layers.map((layer) => readCell(target.tilemap, layer, at)).find((read) => read !== null && read.key !== 0);
  if (!found) return false;
  const store = useTilemapStore.getState();
  store.setStamp({ columns: 1, rows: 1, keys: [found.key] });
  store.setFlags(found.flags);
  return true;
};

export { pickAt };
