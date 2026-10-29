/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { Animation, Artwork, CommandStep, SpriteId } from '@bxel/document';
import { animationStep } from '../timeline/animation-step';
import type { AddRequest } from './add-frames.type';
import { eligibleSprites } from './eligible-sprites';
import { sheetSprites } from './sheet-sprites';
import { fileStripSteps } from './file-strip-steps';
import { imageSteps } from './image-steps';
import { stripSteps } from './strip-steps';

const spriteSteps = (animation: Animation, ids: readonly SpriteId[], request: { at: number; durationMs: number; mode: 'reference' | 'copy' }): CommandStep[] =>
  ids.map((sprite, index) =>
    animationStep({ animation }, COMMAND_NAME.animationFrameAdd, {
      source: { kind: 'sprite', sprite, mode: request.mode },
      at: request.at + index,
      durationMs: request.durationMs,
    }),
  );

const addFramesSteps = (artwork: Artwork, animation: Animation, request: AddRequest): CommandStep[] => {
  if (request.kind === 'sprites') return spriteSteps(animation, request.sprites, request);
  if (request.kind === 'strip') return stripSteps(animation, request);
  if (request.kind === 'images') return imageSteps(animation, request.frames, request);
  if (request.kind === 'file') return fileStripSteps(animation, request);
  const sheet = artwork.sheets.find((each) => each.id === request.sheet);
  const ids = sheet ? sheetSprites(sheet, eligibleSprites(artwork, animation).sprites).map((sprite) => sprite.id) : [];
  return spriteSteps(animation, ids, request);
};

export { addFramesSteps };
