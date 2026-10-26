/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork, CommandStep } from '@bxel/document';
import { artworkFromSteps } from './artwork-from-steps';

const step = (name: string, options: unknown, ref?: string): CommandStep => ({ name, targets: null, options, ...(ref ? { ref } : {}) });

const paint = (sprite: string, value: number): CommandStep => ({
  name: COMMAND_NAME.pixelsPatch,
  targets: { sprites: [{ ref: sprite }], layers: { by: 'all' }, frames: { by: 'all' } },
  options: { rect: { x: 0, y: 0, width: 8, height: 8 }, pixels: Uint8Array.from(Array.from({ length: 64 }, () => value)), skipZero: false },
});

const at = (index: number) => ({ by: 'index', index });

const owned = (index: number): CommandStep =>
  step(COMMAND_NAME.animationFrameOwn, { animation: { ref: 'water' }, frame: at(index) }, `frame${index}`);

const animatedArtwork = (): Artwork =>
  artworkFromSteps('Water', [
    step(COMMAND_NAME.animationCreate, { name: 'water', source: { kind: 'blank', width: 8, height: 8, frames: 2, durationMs: 100 } }, 'water'),
    owned(0),
    owned(1),
    paint('frame0', 1),
    paint('frame1', 2),
    step(COMMAND_NAME.animationTagAdd, { animation: { ref: 'water' }, kind: 'span', name: 'flow', from: at(0), to: at(1) }),
    step(COMMAND_NAME.tilesetCreate, { name: 'ground', tileWidth: 8, tileHeight: 8 }, 'ground'),
    step(COMMAND_NAME.tileAdd, { tileset: { ref: 'ground' } }),
    step(COMMAND_NAME.tileAnimation, { tileset: { ref: 'ground' }, key: 1, change: { kind: 'set', animation: { ref: 'water' } } }),
    step(COMMAND_NAME.tilemapCreate, { name: 'sea', tileset: { ref: 'ground' }, columns: 4, rows: 3 }),
  ]);

export { animatedArtwork };
