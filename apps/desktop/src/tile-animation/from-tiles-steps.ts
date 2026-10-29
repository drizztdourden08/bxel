/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep, Tileset } from '@bxel/document';
import { TILE_ANIMATION_REF } from './tile-animation.constants';
import type { TileStill } from './tile-animation-steps.type';

const frameRef = (at: number): string => `${TILE_ANIMATION_REF.sprite}_${at}`;

const fromTilesSteps = (tileset: Tileset, keys: readonly number[], stills: { name: string; frames: readonly TileStill['pixels'][] }): readonly CommandStep[] => {
  const { tileWidth: width, tileHeight: height } = tileset;
  const anim = { ref: TILE_ANIMATION_REF.animation };
  const create: CommandStep = {
    name: COMMAND_NAME.animationCreate,
    targets: null,
    options: { name: stills.name, source: { kind: 'blank', width, height, frames: keys.length, bankId: tileset.bankId } },
    ref: TILE_ANIMATION_REF.animation,
  };
  const frames = stills.frames.flatMap((pixels, at): CommandStep[] => [
    { name: COMMAND_NAME.animationFrameOwn, targets: null, options: { animation: anim, frame: { by: 'index', index: at } }, ref: frameRef(at) },
    {
      name: COMMAND_NAME.pixelsPatch,
      targets: { sprites: [{ ref: frameRef(at) }], layers: { by: 'all' }, frames: { by: 'all' } },
      options: { rect: { x: 0, y: 0, width, height }, pixels, skipZero: false },
    },
  ]);
  const link: CommandStep = {
    name: COMMAND_NAME.tileAnimation,
    targets: null,
    options: { tileset: tileset.id, key: keys[0], change: { kind: 'set', animation: anim, tag: null, start: 'together' } },
  };
  return [create, ...frames, link];
};

export { fromTilesSteps };
