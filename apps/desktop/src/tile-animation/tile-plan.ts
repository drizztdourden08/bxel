/* @layer renderer-app @kind logic */
import { cellKey, findTileset, tilePlayback } from '@bxel/document';
import type { Artwork, Tilemap, TilePlayback } from '@bxel/document';
import type { PlannedCell, TilePlan } from './tile-animation.type';

const tilePlan = (artwork: Artwork, tilemap: Tilemap): TilePlan => {
  const tileset = findTileset(artwork, tilemap.tilesetId);
  if (!tileset || !tileset.tiles.some((tile) => tile.animation)) return { artwork, tilemap, cells: [] };
  const playbacks = new Map<number, TilePlayback | null>();
  for (const tile of tileset.tiles) playbacks.set(tile.key, tile.animation ? tilePlayback(artwork, tileset, tile) : null);
  const cells: PlannedCell[] = [];
  for (const layer of tilemap.layers.filter((item) => item.visible)) {
    layer.cells.forEach((cell, index) => {
      const key = cellKey(cell);
      const playback = key === 0 ? null : playbacks.get(key);
      if (playback) cells.push({ layer: layer.id, index, key, playback });
    });
  }
  return { artwork, tilemap, cells };
};

export { tilePlan };
