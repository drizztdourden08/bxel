/* @layer renderer-app @kind logic */
import { announce } from '@drizztdourden08/brock-react';
import { COMMAND_NAME } from '@bxel/document';
import type { TagId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { idRef } from './id-ref';
import { spanTagOf } from './span-tag-of';
import { tagById } from './tag-by-id';
import { TIMELINE_SAY } from './timeline-say.constants';

const changeTag = (label: string, tagId: TagId, fields: Readonly<Record<string, unknown>>): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const options = { tag: idRef(tagId), ...fields };
  if (runDocument(label, [animationStep(focus, COMMAND_NAME.animationTagUpdate, options)]) === null) return false;
  const name = typeof fields.name === 'string' ? fields.name : spanTagOf(focus.animation, tagById(focus.animation, tagId))?.name;
  announce(TIMELINE_SAY.tagChanged(name ?? ''));
  return true;
};

export { changeTag };
