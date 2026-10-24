/* @layer renderer-app @kind logic */
import { useTilemapStore } from '../../stores/useTilemapStore';
import type { MapTarget } from '../tilemap.type';

const terrainActive = (target: MapTarget): boolean =>
  useTilemapStore.getState().terrainBrush && (target.tileset.terrain?.keys.some((key) => key !== 0) ?? false);

export { terrainActive };
