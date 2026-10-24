/* @layer core @kind logic */
import type { Draft } from './draft.type';
import type { LayerTarget } from './layer-target.type';
import { updateTilemap } from './update-tilemap';

const editLayerCells = (draft: Draft, target: LayerTarget, edit: (cells: Uint32Array) => void): void => {
  const { layer } = target;
  const cells = layer.cells.slice();
  edit(cells);
  if (cells.every((cell, index) => cell === layer.cells[index])) return;
  updateTilemap(draft, target.tilemap.id, (tilemap) => ({
    ...tilemap,
    layers: tilemap.layers.map((item) => (item.id === layer.id ? { ...item, cells } : item)),
  }));
};

export { editLayerCells };
