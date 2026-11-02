/* @layer renderer-app @kind logic */
import type { SpriteId } from '@bxel/document';
import { toast } from '@drizztdourden08/brock-react';
import { ADD_TEXT, DURATION_START } from '../add-frames/add-frames.constants';
import { eligibleSprites } from '../add-frames/eligible-sprites';
import { runAddFrames } from '../add-frames/run-add-frames';
import { currentFocus } from '../timeline/current-focus';

const addToAnimation = (spriteIds: readonly SpriteId[]): void => {
  const focus = currentFocus();
  if (!focus || focus.readOnly) return;
  const allowed = new Set(eligibleSprites(focus.artwork, focus.animation).sprites.map((sprite) => sprite.id));
  const sprites = spriteIds.filter((id) => allowed.has(id));
  if (sprites.length === 0) {
    toast(ADD_TEXT.notDroppable, { variant: 'warning' });
    return;
  }
  runAddFrames({ kind: 'sprites', sprites, mode: 'reference', durationMs: DURATION_START, at: focus.animation.frames.length });
};

export { addToAnimation };
