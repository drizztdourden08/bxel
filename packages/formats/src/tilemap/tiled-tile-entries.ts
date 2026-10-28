/* @layer core @kind logic */
import { tiledCollisionObject } from './tiled-collision-object';
import { tiledGridId } from './tiled-grid-id';
import { tiledTileAnimation } from './tiled-tile-animation';
import { tiledTileProperties } from './tiled-tile-properties';
import type { TilemapExportInput, TileAnimationEntry, TileShapeEntry, TilesetEntry } from './tilemap.type';

const propertiesOf = (tile: TilesetEntry, animation: TileAnimationEntry | undefined, input: TilemapExportInput): Record<string, unknown>[] => [
  ...(tile.shapes?.[0] ? [{ name: 'bxelCollision', type: 'string', value: tile.shapes[0].kind }] : []),
  ...(animation?.start === 'random' ? [{ name: 'bxelStart', type: 'string', value: 'random' }] : []),
  ...(tile.turns && tile.turns !== 'none' ? [{ name: 'bxelTurns', type: 'string', value: tile.turns }] : []),
  ...tiledTileProperties(tile, input.tileset.fields ?? []),
];

const shapeObject = (shape: TileShapeEntry, input: TilemapExportInput, id: number): Record<string, unknown> => {
  const size = { width: input.tileWidth, height: input.tileHeight };
  const object = tiledCollisionObject(shape, size, id);
  const oneWay = shape.oneWay ? { properties: [{ name: 'oneWay', type: 'bool', value: true }] } : {};
  return { ...object, type: shape.layer, ...oneWay };
};

const groupOf = (tile: TilesetEntry, input: TilemapExportInput, objectId: number): Record<string, unknown> | undefined => {
  if (!tile.shapes || tile.shapes.length === 0) return undefined;
  return {
    draworder: 'index',
    id: objectId,
    name: '',
    objects: tile.shapes.map((shape, at) => shapeObject(shape, input, objectId + at + 1)),
    opacity: 1,
    type: 'objectgroup',
    visible: true,
    x: 0,
    y: 0,
  };
};

const hasExtras = (tile: TilesetEntry): boolean =>
  (tile.shapes?.length ?? 0) > 0 || Boolean(tile.type) || tile.probability !== undefined || Boolean(tile.data) || Boolean(tile.turns && tile.turns !== 'none');

const tiledTileEntries = (input: TilemapExportInput): Record<string, unknown>[] => {
  const animations = new Map((input.tileset.animations ?? []).map((animation) => [animation.key, animation]));
  let objectId = 0;
  return input.tileset.tiles.flatMap((tile) => {
    const animation = animations.get(tile.key);
    if (!hasExtras(tile) && !animation) return [];
    const group = groupOf(tile, input, objectId + 1);
    if (group) objectId += 1 + (tile.shapes?.length ?? 0);
    const properties = propertiesOf(tile, animation, input);
    return [
      {
        id: tiledGridId(input, tile.x, tile.y),
        ...(animation ? { animation: tiledTileAnimation(input, animation) } : {}),
        ...(tile.type ? { type: tile.type } : {}),
        ...(tile.probability !== undefined ? { probability: tile.probability } : {}),
        ...(properties.length > 0 ? { properties } : {}),
        ...(group ? { objectgroup: group } : {}),
      },
    ];
  });
};

export { tiledTileEntries };
