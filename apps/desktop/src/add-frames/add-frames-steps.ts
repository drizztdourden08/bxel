/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Animation, Artwork, CommandStep, SpriteId } from '@bxel/document';
import { animationStep } from '../timeline/animation-step';
import type { AddRequest } from './add-frames.type';
import { eligibleSprites } from './eligible-sprites';
import { sheetSprites } from './sheet-sprites';
import { stripGrid } from './strip-grid';

const spriteSteps = (animation: Animation, ids: readonly SpriteId[], request: { at: number; durationMs: number; mode: 'reference' | 'copy' }): CommandStep[] =>
  ids.map((sprite, index) =>
    animationStep({ animation }, COMMAND_NAME.animationFrameAdd, {
      source: { kind: 'sprite', sprite, mode: request.mode },
      at: request.at + index,
      durationMs: request.durationMs,
    }),
  );

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

const addFramesSteps = (artwork: Artwork, animation: Animation, request: AddRequest): CommandStep[] => {
  if (request.kind === 'sprites') return spriteSteps(animation, request.sprites, request);
  if (request.kind === 'strip') return stripSteps(animation, request);
  const sheet = artwork.sheets.find((each) => each.id === request.sheet);
  const ids = sheet ? sheetSprites(sheet, eligibleSprites(artwork, animation).sprites).map((sprite) => sprite.id) : [];
  return spriteSteps(animation, ids, request);
};

export { addFramesSteps };
