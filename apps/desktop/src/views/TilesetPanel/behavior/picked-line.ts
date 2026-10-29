/* @layer renderer-app @kind logic */
import { TILESET_TEXT } from '../TilesetPanel.constants';
import type { TilesetModel } from '../TilesetPanel.type';

const pickedLine = (model: TilesetModel): string => {
  if (model.selected.length > 1) return TILESET_TEXT.pickedMany(model.selected.length);
  const cell = model.pickedKey === null ? undefined : model.byKey.get(model.pickedKey);
  if (!cell) return TILESET_TEXT.noPick;
  const type = cell.tile.type ? `, ${cell.tile.type}` : '';
  return `${TILESET_TEXT.pickedOne(cell.tile.key, cell.uses)}${type}`;
};

export { pickedLine };
