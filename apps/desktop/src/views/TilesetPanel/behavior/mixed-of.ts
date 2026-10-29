/* @layer renderer-app @kind logic */
import type { Tile } from '@bxel/document';
import type { Mixed } from './mixed-of.type';

const mixedOf = <T>(tiles: readonly Tile[], read: (tile: Tile) => T | undefined): Mixed<T> => {
  const first = tiles[0] ? read(tiles[0]) : undefined;
  const mixed = tiles.some((tile) => read(tile) !== first);
  return { mixed, value: mixed ? undefined : first };
};

export { mixedOf };
