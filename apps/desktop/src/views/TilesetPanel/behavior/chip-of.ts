/* @layer renderer-app @kind logic */
import type { Tile, Tileset } from '@bxel/document';
import { CHIP_COLOURS } from '../TilesetPanel.constants';

interface Chip {
  letter: string;
  tone: number;
}

const chipOf = (tileset: Tileset, tile: Tile): Chip | null => {
  const entry = (tileset.fields ?? []).flatMap((field) => {
    const value = tile.data?.[field.name];
    return value === undefined ? [] : [{ field, value }];
  })[0];
  if (!entry) return null;
  const { field, value } = entry;
  if (field.kind === 'choice') {
    const at = (field.choices ?? []).indexOf(String(value));
    return { letter: String(value).slice(0, 1).toUpperCase(), tone: Math.max(0, at) % CHIP_COLOURS.length };
  }
  if (field.kind === 'bool') return { letter: value === true ? 'Y' : 'N', tone: 1 };
  return { letter: field.name.slice(0, 1).toUpperCase(), tone: 0 };
};

export { chipOf };
