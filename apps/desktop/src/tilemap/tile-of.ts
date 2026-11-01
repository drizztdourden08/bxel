/* @layer renderer-app @kind logic */
import type { Tile } from '@bxel/document';
import { currentTileset } from './current-tileset';
import { pickedKey } from './picked-key';

const tileOf = (key: number | undefined): Tile | null => {
  const wanted = key ?? pickedKey();
  return currentTileset()?.tiles.find((each) => each.key === wanted) ?? null;
};

export { tileOf };
