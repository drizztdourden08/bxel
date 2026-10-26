/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimationId, CommandStep, TagId, TileAnimationStart, Tileset } from '@bxel/document';
import { TILE_ANIMATION_REF } from './tile-animation.constants';

type TileLink = { readonly animation: AnimationId; readonly tag: TagId | null; readonly start: TileAnimationStart };

type TileStill = { readonly name: string; readonly pixels: Uint8Array };

const setStep = (tileset: Tileset, key: number, link: TileLink): CommandStep => ({
  name: COMMAND_NAME.tileAnimation,
  targets: null,
  options: { tileset: tileset.id, key, change: { kind: 'set', animation: link.animation, tag: link.tag, start: link.start } },
});

const detachStep = (tileset: Tileset, key: number): CommandStep => ({
  name: COMMAND_NAME.tileAnimation,
  targets: null,
  options: { tileset: tileset.id, key, change: { kind: 'clear' } },
});

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

export { detachStep, fromTileSteps, setStep };
export type { TileLink };
