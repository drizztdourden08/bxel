/* @layer renderer-app @kind logic */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { COMMAND_NAME, sliceAsset } from '@bxel/document';
import type { TargetScope } from '@bxel/document';
import { encodeAnimation } from '@bxel/document/native';
import { ANIMATION } from './animation.constants';
import { runStep } from './run-step';
import { spriteNamed } from './sprite-named';
import { startEngine } from './start-engine';

const SIDE = ANIMATION.side;

const buildAnimationAsset = async (dir: string): Promise<string> => {
  const engine = startEngine({ name: 'Walk', palette: 'Walk 16', sprite: { name: 'pose 1', width: SIDE, height: SIDE } });
  runStep(engine, COMMAND_NAME.spriteCreate, { name: 'pose 2', width: SIDE, height: SIDE });
  runStep(engine, COMMAND_NAME.spriteCreate, { name: 'pose 3', width: SIDE, height: SIDE });
  ANIMATION.durations.forEach((_duration, at) => {
    const sprite = spriteNamed(engine, `pose ${at + 1}`);
    const targets: TargetScope = { sprites: [sprite.id], layers: { by: 'all' }, frames: { by: 'all' } };
    const rect = { x: at * 2 + 1, y: at + 1, width: 2, height: 3 };
    runStep(engine, COMMAND_NAME.pixelsPatch, { rect, pixels: new Uint8Array(6).fill(ANIMATION.swatches[at] ?? 1), skipZero: false }, targets);
  });
  const poses = ANIMATION.durations.map((_duration, at) => spriteNamed(engine, `pose ${at + 1}`).id);
  runStep(engine, COMMAND_NAME.animationCreate, { name: ANIMATION.spriteName, source: { kind: 'sprites', sprites: poses, mode: 'copy' } });
  const animation = engine.state().artwork.animations[0];
  if (!animation) throw new Error('the animation was not made');
  ANIMATION.durations.forEach((durationMs, index) => {
    runStep(engine, COMMAND_NAME.animationFrameUpdate, { animation: animation.id, frame: { by: 'index', index }, durationMs });
  });
  const span = { name: ANIMATION.tagName, from: { by: 'index', index: 0 }, to: { by: 'index', index: 2 } };
  runStep(engine, COMMAND_NAME.animationTagAdd, { animation: animation.id, kind: 'span', ...span });
  const path = join(dir, `${ANIMATION.spriteName}.bxanim`);
  await writeFile(path, encodeAnimation(sliceAsset(engine.state().artwork, { kind: 'animation', id: animation.id }, new Map()), null, () => 0));
  return path;
};

export { buildAnimationAsset };
