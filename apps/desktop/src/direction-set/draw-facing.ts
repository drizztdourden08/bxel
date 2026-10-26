/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { AnimFacing } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from '../timeline/animation-step';
import { currentFocus } from '../timeline/current-focus';
import { facingTag } from '../timeline/facing-tag';
import { selectTag } from '../timeline/select-tag';
import { TIMELINE_LABEL } from '../timeline/timeline.constants';

const drawFacing = (facing: AnimFacing): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  if (focus.animation.tags.find((tag) => tag.kind === 'mirror' && tag.facing === facing) === undefined) return false;
  const step = animationStep(focus, COMMAND_NAME.animationFacingDraw, { facing });
  if (runDocument(TIMELINE_LABEL.drawFacing, [step]) === null) return false;
  const drawn = facingTag(currentFocus()?.animation ?? focus.animation, facing);
  if (drawn) selectTag(drawn.id);
  return true;
};

export { drawFacing };
