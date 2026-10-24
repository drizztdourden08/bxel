/* @layer core @kind logic */
import { tiledCollisionObject } from './tiled-collision-object';
import { tiledGridId } from './tiled-grid-id';
import type { TilemapExportInput } from './tilemap.type';

const tiledTileEntries = (input: TilemapExportInput): Record<string, unknown>[] => {
  const size = { width: input.tileWidth, height: input.tileHeight };
  let objectId = 0;
  return input.tileset.tiles.flatMap((tile) => {
    if (!tile.collision) return [];
    objectId += 1;
    return [
      {
        id: tiledGridId(input, tile.x, tile.y),
        properties: [{ name: 'bxelCollision', type: 'string', value: tile.collision.kind }],
        objectgroup: {
          draworder: 'index',
          id: objectId,
          name: '',
          objects: [tiledCollisionObject(tile.collision, size, objectId)],
          opacity: 1,
          type: 'objectgroup',
          visible: true,
          x: 0,
          y: 0,
        },
      },
    ];
  });
};

export { tiledTileEntries };
