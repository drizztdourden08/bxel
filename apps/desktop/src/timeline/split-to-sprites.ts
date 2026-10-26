/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import { toast } from '@drizztdourden08/brock-react';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { currentSelection } from './current-selection';
import { idRef } from './id-ref';
import { TIMELINE_LABEL, TIMELINE_TEXT } from './timeline.constants';

const splitToSprites = (): number => {
  const focus = currentFocus();
  if (!focus) return 0;
  const picked = currentSelection(focus);
  const frames = picked.length > 1 ? { frames: picked.map(idRef) } : {};
  const done = runDocument(TIMELINE_LABEL.split, [animationStep(focus, COMMAND_NAME.animationSplit, frames)]);
  if (!done) return 0;
  const made = done.report['sprites'] ?? 0;
  toast(made === 0 ? TIMELINE_TEXT.nothingToSplit : TIMELINE_TEXT.splitDone(made), { variant: 'info' });
  return made;
};

export { splitToSprites };
