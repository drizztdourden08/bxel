/* @layer core @kind logic */
import { tiledCollisionObject } from './tiled-collision-object';
import { tiledGridId } from './tiled-grid-id';
import { tiledTileAnimation } from './tiled-tile-animation';
import type { TilemapExportInput, TileAnimationEntry, TilesetEntry } from './tilemap.type';

const propertiesOf = (tile: TilesetEntry, animation: TileAnimationEntry | undefined): Record<string, unknown>[] => [
  ...(tile.collision ? [{ name: 'bxelCollision', type: 'string', value: tile.collision.kind }] : []),
  ...(animation?.start === 'random' ? [{ name: 'bxelStart', type: 'string', value: 'random' }] : []),
];

const groupOf = (tile: TilesetEntry, input: TilemapExportInput, objectId: number): Record<string, unknown> | undefined => {
  if (!tile.collision) return undefined;
  const size = { width: input.tileWidth, height: input.tileHeight };
  return {
    draworder: 'index',
    id: objectId,
    name: '',
    objects: [tiledCollisionObject(tile.collision, size, objectId)],
    opacity: 1,
    type: 'objectgroup',
    visible: true,
    x: 0,
    y: 0,
  };
};

const tiledTileEntries = (input: TilemapExportInput): Record<string, unknown>[] => {
  const animations = new Map((input.tileset.animations ?? []).map((animation) => [animation.key, animation]));
  let objectId = 0;
  return input.tileset.tiles.flatMap((tile) => {
    const animation = animations.get(tile.key);
    if (!tile.collision && !animation) return [];
    if (tile.collision) objectId += 1;
    const group = groupOf(tile, input, objectId);
    const properties = propertiesOf(tile, animation);
    return [
      {
        id: tiledGridId(input, tile.x, tile.y),
        ...(animation ? { animation: tiledTileAnimation(input, animation) } : {}),
        ...(properties.length > 0 ? { properties } : {}),
        ...(group ? { objectgroup: group } : {}),
      },
    ];
  });
};

export { tiledTileEntries };
