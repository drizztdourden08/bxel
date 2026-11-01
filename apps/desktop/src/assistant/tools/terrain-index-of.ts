/* @layer renderer-app @kind logic */
import { terrainSetsOf } from '@bxel/document';
import type { Tileset } from '@bxel/document';

const terrainIndexOf = (tileset: Tileset): ReadonlyMap<number, number> => {
  const found = new Map<number, number>();
  for (const [index, set] of terrainSetsOf(tileset).entries()) {
    for (const variants of set.slots) {
      for (const variant of variants) if (!found.has(variant.key)) found.set(variant.key, index);
    }
  }
  return found;
};

export { terrainIndexOf };
