/* @layer renderer-app @kind logic */
import { findSprite, slotMask, terrainSetsOf, tileLayout, tileShapes, tileUseCounts } from '@bxel/document';
import type { Artwork, Tile, TileShape, Tileset } from '@bxel/document';

const shapeDetail = (shape: TileShape) => ({
  kind: shape.kind,
  layer: shape.layer,
  oneWay: shape.oneWay === true,
  ...(shape.kind === 'rect' ? { rect: { x: shape.x, y: shape.y, width: shape.width, height: shape.height } } : {}),
  ...(shape.kind === 'polygon' ? { points: shape.points.map((point) => ({ x: point.x, y: point.y })) } : {}),
});

const tileDetail = (artwork: Artwork, tile: Tile, extra: { index: number; uses: number }) => ({
  key: tile.key,
  spriteId: tile.spriteId,
  name: findSprite(artwork, tile.spriteId)?.name ?? '',
  index: extra.index,
  uses: extra.uses,
  shapes: tileShapes(tile).map(shapeDetail),
  animation: tile.animation ?? null,
  type: tile.type ?? null,
  probability: tile.probability ?? 1,
  turns: tile.turns ?? ('none' as const),
  data: { ...tile.data },
});

const tilesetDetail = (artwork: Artwork, tileset: Tileset) => {
  const layout = tileLayout(tileset);
  const uses = tileUseCounts(artwork, tileset.id);
  return {
    tilesetId: tileset.id,
    columns: layout.columns,
    rows: layout.rows,
    collisionLayers: [...(tileset.collisionLayers ?? ['solid'])],
    fields: (tileset.fields ?? []).map((field) => ({ name: field.name, kind: field.kind, default: field.default, ...(field.choices ? { choices: [...field.choices] } : {}) })),
    terrainSets: terrainSetsOf(tileset).map((set) => ({
      id: set.id,
      name: set.name,
      kind: set.kind,
      slots: set.slots.map((variants) => variants.map((variant) => ({ ...variant }))),
      masks: set.slots.map((_variants, slot) => slotMask(set.kind, slot)),
      missing: set.slots.flatMap((variants, slot) => (variants.length === 0 ? [slot] : [])),
    })),
    tiles: tileset.tiles.map((tile) => tileDetail(artwork, tile, { index: layout.indexOf.get(tile.key) ?? 0, uses: uses.get(tile.key) ?? 0 })),
  };
};

export { tilesetDetail };
