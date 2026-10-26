/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Tileset } from '@bxel/document';
import { TILE_ANIMATION_REF } from './tile-animation.constants';
import type { TileStill } from './tile-animation-steps.type';

const fromTileSteps = (tileset: Tileset, key: number, still: TileStill): readonly CommandStep[] => {
  const { tileWidth: width, tileHeight: height } = tileset;
  const anim = { ref: TILE_ANIMATION_REF.animation };
  return [
    {
      name: COMMAND_NAME.animationCreate,
      targets: null,
      options: { name: still.name, source: { kind: 'blank', width, height, frames: 1, bankId: tileset.bankId } },
      ref: TILE_ANIMATION_REF.animation,
    },
    {
      name: COMMAND_NAME.animationFrameOwn,
      targets: null,
      options: { animation: anim, frame: { by: 'index', index: 0 } },
      ref: TILE_ANIMATION_REF.sprite,
    },
    {
      name: COMMAND_NAME.pixelsPatch,
      targets: { sprites: [{ ref: TILE_ANIMATION_REF.sprite }], layers: { by: 'all' }, frames: { by: 'all' } },
      options: { rect: { x: 0, y: 0, width, height }, pixels: still.pixels, skipZero: false },
    },
    {
      name: COMMAND_NAME.tileAnimation,
      targets: null,
      options: { tileset: tileset.id, key, change: { kind: 'set', animation: anim, tag: null, start: 'together' } },
    },
  ];
};

export { fromTileSteps };
