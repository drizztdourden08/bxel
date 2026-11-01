/* @layer core @kind logic */
import { layerOpacity } from './layer-opacity';
import { tiledGids } from './tiled-gids';
import type { TiledLayer } from './tiled-layers.type';
import type { TilemapExportInput, TilemapLayerInput } from './tilemap.type';

const tiledLayers = (input: TilemapExportInput): { layers: TiledLayer[]; count: number } => {
  let count = 0;
  const known = new Set(input.layers.flatMap((layer) => (layer.group && layer.id ? [layer.id] : [])));
  const parentOf = (layer: TilemapLayerInput): string | undefined => (layer.parentId && known.has(layer.parentId) ? layer.parentId : undefined);
  const build = (layer: TilemapLayerInput): TiledLayer => {
    count += 1;
    const head = { id: count, name: layer.name };
    const tail = { visible: layer.visible, locked: layer.locked, opacity: layerOpacity(layer), x: 0, y: 0 };
    if (layer.group) return { ...head, type: 'group', ...tail, layers: input.layers.filter((child) => parentOf(child) === layer.id).map(build) };
    return { ...head, type: 'tilelayer', ...tail, width: input.columns, height: input.rows, data: tiledGids(input, layer.cells) };
  };
  const layers = input.layers.filter((layer) => parentOf(layer) === undefined).map(build);
  return { layers, count };
};

export { tiledLayers };
