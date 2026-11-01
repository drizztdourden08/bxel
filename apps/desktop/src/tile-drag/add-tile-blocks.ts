/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { currentTileset } from '../tilemap/current-tileset';
import { TILE_DROP_LIMIT, TILE_DROP_REF, TILE_DROP_TEXT } from './tile-drag.constants';
import type { TileBlock, TilesAdded } from './tile-drag.type';

const blockSteps = (tilesetId: string, blocks: readonly TileBlock[]): CommandStep[] =>
  blocks.flatMap((block, index): CommandStep[] => {
    const ref = `${TILE_DROP_REF}${index}`;
    return [
      { name: COMMAND_NAME.tileAdd, targets: null, options: { tileset: tilesetId }, ref },
      {
        name: COMMAND_NAME.pixelsPatch,
        targets: { sprites: [{ ref }], layers: { by: 'all' as const }, frames: { by: 'all' as const } },
        options: { rect: { x: 0, y: 0, width: block.width, height: block.height }, pixels: block.pixels, skipZero: false },
      },
    ];
  });

const addTileBlocks = (blocks: readonly TileBlock[]): TilesAdded => {
  const tileset = currentTileset();
  if (!tileset) return { ok: false, reason: TILE_DROP_TEXT.noTileset };
  if (blocks.length === 0) return { ok: false, reason: TILE_DROP_TEXT.empty };
  if (blocks.length > TILE_DROP_LIMIT) return { ok: false, reason: TILE_DROP_TEXT.tooMany(TILE_DROP_LIMIT) };
  const done = runDocument(TILE_DROP_TEXT.label(blocks.length), blockSteps(tileset.id, blocks));
  return done ? { ok: true, count: blocks.length } : { ok: false, reason: '' };
};

export { addTileBlocks };
