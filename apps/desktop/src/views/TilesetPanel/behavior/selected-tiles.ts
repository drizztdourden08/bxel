/* @layer renderer-app @kind logic */
import type { Tile } from '@bxel/document';
import type { TilesetModel } from '../TilesetPanel.type';

const selectedTiles = (model: TilesetModel): readonly Tile[] =>
  model.selected.flatMap((key) => {
    const cell = model.byKey.get(key);
    return cell ? [cell.tile] : [];
  });

export { selectedTiles };
