/* @layer renderer-app @kind logic */
import type { Tile } from '@bxel/document';
import type { TilesetModel } from '../TilesetPanel.type';

interface Mixed<T> {
  mixed: boolean;
  value: T | undefined;
}

const selectedTiles = (model: TilesetModel): readonly Tile[] =>
  model.selected.flatMap((key) => {
    const cell = model.byKey.get(key);
    return cell ? [cell.tile] : [];
  });

const mixedOf = <T>(tiles: readonly Tile[], read: (tile: Tile) => T | undefined): Mixed<T> => {
  const first = tiles[0] ? read(tiles[0]) : undefined;
  const mixed = tiles.some((tile) => read(tile) !== first);
  return { mixed, value: mixed ? undefined : first };
};

export type { Mixed };
export { mixedOf, selectedTiles };
