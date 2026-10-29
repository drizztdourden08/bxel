/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Animation, CommandStep } from '@bxel/document';
import { animationStep } from '../timeline/animation-step';
import type { AddRequest } from './add-frames.type';
import { stripGrid } from './strip-grid';

const stripSteps = (animation: Animation, request: Extract<AddRequest, { kind: 'strip' }>): CommandStep[] => {
  const add = animationStep({ animation }, COMMAND_NAME.animationFrameAdd, {
    source: { kind: 'strip', sprite: request.sprite, grid: stripGrid(request.spec) },
    at: request.at,
    durationMs: request.durationMs,
  });
  if (request.result === 'cells') return [add];
  const frames = Array.from({ length: request.cells }, (_, index) => ({ by: 'index', index: request.at + index }));
  return [add, animationStep({ animation }, COMMAND_NAME.animationSplit, { frames })];
};

export { stripSteps };
