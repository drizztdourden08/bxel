/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TagId } from '@bxel/document';
import { runDocument } from '../sheet/run-document';
import { animationStep } from './animation-step';
import { currentFocus } from './current-focus';
import { idRef } from './id-ref';

const changeTag = (label: string, tagId: TagId, fields: Readonly<Record<string, unknown>>): boolean => {
  const focus = currentFocus();
  if (!focus) return false;
  const options = { tag: idRef(tagId), ...fields };
  return runDocument(label, [animationStep(focus, COMMAND_NAME.animationTagUpdate, options)]) !== null;
};

export { changeTag };
