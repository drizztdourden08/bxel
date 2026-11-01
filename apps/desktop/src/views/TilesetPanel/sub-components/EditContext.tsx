/* @layer renderer-app @kind component */
import type { TilesetModelProps } from '../TilesetPanel.type';
import { TerrainContext } from './TerrainContext';

const EditContext = ({ model }: TilesetModelProps) => {
  const editing = model.editMode === 'edit' ? model.cells.find((cell) => cell.editing) : undefined;
  return editing ? <TerrainContext model={model} tileKey={editing.tile.key} /> : null;
};

export { EditContext };
