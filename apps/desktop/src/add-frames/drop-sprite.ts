/* @layer renderer-app @kind logic */
import { toast } from '@drizztdourden08/brock-react';
import { currentFocus } from '../timeline/current-focus';
import { ADD_TEXT, DURATION_START } from './add-frames.constants';
import { eligibleSprites } from './eligible-sprites';
import { runAddFrames } from './run-add-frames';

const dropSprite = (spriteId: string, at: number, copy: boolean): boolean => {
  const focus = currentFocus();
  if (!focus || focus.readOnly) return false;
  const { sprites } = eligibleSprites(focus.artwork, focus.animation);
  const sprite = sprites.find((each) => each.id === spriteId);
  if (!sprite) {
    toast(ADD_TEXT.notDroppable, { variant: 'warning' });
    return false;
  }
  return runAddFrames({ kind: 'sprites', sprites: [sprite.id], mode: copy ? 'copy' : 'reference', durationMs: DURATION_START, at });
};

export { dropSprite };
