/* @layer renderer-app @kind logic */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { COMMAND_NAME, sliceAsset } from '@bxel/document';
import { encodeAnimation } from '@bxel/document/native';
import { runStep } from './run-step';
import { startEngine } from './start-engine';

const SIDE = 8;

const buildBlankAnimation = async (dir: string, name: string): Promise<string> => {
  const engine = startEngine({ name, palette: 'Blank 16', sprite: { name: 'pose', width: SIDE, height: SIDE } });
  runStep(engine, COMMAND_NAME.animationCreate, { name, source: { kind: 'blank', width: SIDE, height: SIDE, frames: 1 } });
  const animation = engine.state().artwork.animations[0];
  if (!animation) throw new Error('the animation was not made');
  const path = join(dir, `${name}.bxanim`);
  await writeFile(path, encodeAnimation(sliceAsset(engine.state().artwork, { kind: 'animation', id: animation.id }, new Map()), null, () => 0));
  return path;
};

export { buildBlankAnimation };
