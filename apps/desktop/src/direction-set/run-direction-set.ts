/* @layer renderer-app @kind logic */
import { COMMAND_NAME, FACING_SETS } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from '../timeline/animation-step';
import { currentFocus } from '../timeline/current-focus';
import { selectTag } from '../timeline/select-tag';
import { TIMELINE_LABEL } from '../timeline/timeline.constants';
import type { DirectionSetSpec } from './direction-set.type';

const runDirectionSet = (spec: DirectionSetSpec): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const options = {
    mode: spec.mode,
    tag: spec.tag.trim(),
    framesPerFacing: spec.framesPerFacing,
    mirrored: spec.mirrored,
    durationMs: spec.durationMs,
  };
  if (runDocument(TIMELINE_LABEL.directions, [animationStep(focus, COMMAND_NAME.animationDirections, options)]) === null) return false;
  const first = FACING_SETS[spec.mode][0];
  const tag = currentFocus()?.animation.tags.find((each) => each.facing === first);
  if (tag) selectTag(tag.id);
  return true;
};

export { runDirectionSet };
