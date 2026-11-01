/* @layer core @kind logic */
import { PERCENT } from './tilemap.constants';
import type { TilemapLayerInput } from './tilemap.type';

const layerOpacity = (layer: TilemapLayerInput): number => (layer.opacity ?? PERCENT) / PERCENT;

export { layerOpacity };
