/* @layer core @kind logic */
import type { TiledMap } from './tiled.type';
import type { LayerCounts, PlannedTile } from './tiled-plan.type';

const plural = (count: number, one: string, many: string): string => (count === 1 ? one : many);

const planWarnings = (map: TiledMap, tiles: readonly PlannedTile[], counts: LayerCounts): string[] => {
  const warnings: string[] = [];
  if (map.skippedLayers > 0) {
    warnings.push(`${map.skippedLayers} ${plural(map.skippedLayers, 'object or image layer was', 'object or image layers were')} left out.`);
  }
  const faded = map.layers.filter((layer) => layer.opacity < 1).length;
  if (faded > 0) warnings.push(`${faded} ${plural(faded, 'layer has', 'layers have')} an opacity below 1. Bxel layers are fully opaque.`);
  const moved = map.layers.filter((layer) => layer.offsetX !== 0 || layer.offsetY !== 0).length;
  if (moved > 0) warnings.push(`${moved} ${plural(moved, 'layer has', 'layers have')} an offset. The offset was dropped.`);
  if (counts.rotated > 0) warnings.push(`${counts.rotated} hexagonal rotations were dropped.`);
  if (counts.missing > 0) warnings.push(`${counts.missing} ${plural(counts.missing, 'cell names', 'cells name')} a tile that is not in the tilesets. They were cleared.`);
  const crowded = tiles.filter((tile) => tile.shapes.length > 1).length;
  if (crowded > 0) warnings.push(`${crowded} ${plural(crowded, 'tile has', 'tiles have')} more than one collision shape. The first was kept.`);
  return warnings;
};

export { planWarnings };
