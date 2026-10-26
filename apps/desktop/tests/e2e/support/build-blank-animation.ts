/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { runStep } from './run-step';
import { startEngine } from './start-engine';
import { writeAnimationFile } from './write-animation-file';

const SIDE = 8;

const buildBlankAnimation = (dir: string, name: string): Promise<string> => {
  const engine = startEngine({ name, palette: 'Blank 16', sprite: { name: 'pose', width: SIDE, height: SIDE } });
  runStep(engine, COMMAND_NAME.animationCreate, { name, source: { kind: 'blank', width: SIDE, height: SIDE, frames: 1 } });
  return writeAnimationFile(dir, name, engine.state().artwork);
};

export { buildBlankAnimation };
