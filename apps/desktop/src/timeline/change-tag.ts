/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { TagId } from '@bxel/document';
import { currentTarget } from '../editor/current-target';
import { runDocument } from '../sheet/run-document';
import { idRef } from './id-ref';
import { spriteStep } from './sprite-step';

const changeTag = (label: string, tagId: TagId, fields: Readonly<Record<string, unknown>>): boolean => {
  const target = currentTarget();
  if (!target) return false;
  const options = { tag: idRef(tagId), ...fields };
  return runDocument(label, [spriteStep(target, COMMAND_NAME.tagUpdate, options)]) !== null;
};

export { changeTag };
