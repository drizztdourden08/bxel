/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { CommandStep } from '@bxel/document';
import type { WaterOptions } from './water-steps.type';

const step = (name: string, options: unknown, ref?: string): CommandStep => ({ name, targets: null, options, ...(ref ? { ref } : {}) });

const at = (index: number) => ({ by: 'index', index });

const owned = (index: number): CommandStep =>
  step(COMMAND_NAME.animationFrameOwn, { animation: { ref: 'water' }, frame: at(index) }, `frame${index}`);

const paint = (side: number, sprite: string, value: number): CommandStep => ({
  name: COMMAND_NAME.pixelsPatch,
  targets: { sprites: [{ ref: sprite }], layers: { by: 'all' }, frames: { by: 'all' } },
  options: { rect: { x: 0, y: 0, width: side, height: side }, pixels: new Uint8Array(side * side).fill(value), skipZero: false },
});

const waterSteps = ({ side, frameMs, indexes, columns, rows }: WaterOptions): CommandStep[] => [
  step(COMMAND_NAME.animationCreate, { name: 'water', source: { kind: 'blank', width: side, height: side, frames: 2, durationMs: frameMs } }, 'water'),
  owned(0),
  owned(1),
  paint(side, 'frame0', indexes[0]),
  paint(side, 'frame1', indexes[1]),
  step(COMMAND_NAME.animationTagAdd, { animation: { ref: 'water' }, kind: 'span', name: 'flow', from: at(0), to: at(1) }),
  step(COMMAND_NAME.tilesetCreate, { name: 'ground', tileWidth: side, tileHeight: side }, 'ground'),
  step(COMMAND_NAME.tileAdd, { tileset: { ref: 'ground' } }),
  step(COMMAND_NAME.tileAnimation, { tileset: { ref: 'ground' }, key: 1, change: { kind: 'set', animation: { ref: 'water' }, start: 'together' } }),
  step(COMMAND_NAME.tilemapCreate, { name: 'sea', tileset: { ref: 'ground' }, columns, rows }, 'sea'),
];

export { step, waterSteps };
