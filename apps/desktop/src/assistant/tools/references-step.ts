/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { addReferenceFromPath } from '../../reference-image/add-reference-from-path';
import { currentViewKey } from '../../reference-image/current-view-key';
import { removeReferenceImage } from '../../reference-image/remove-reference-image';
import { updateReferenceImage } from '../../reference-image/update-reference-image';
import { locationPath } from './location-path';
import { reply } from './reply';
import { REFERENCES_STEP_TEXT } from './references-step.constants';
import type { References } from './references-step.type';
import { viewFail } from './view-fail';
import type { ViewStep } from './view-steps.type';

const addAll = (references: References, context: ToolContext): ToolReply | null => {
  for (const [index, entry] of (references.add ?? []).entries()) {
    const { file, ...fields } = entry;
    const path = locationPath(context, file, `references.add.${index}.file`);
    if (!path.ok) return reply(path);
    const id = addReferenceFromPath(path.value);
    if (id === null) return viewFail(REFERENCES_STEP_TEXT.full, `references.add.${index}`);
    updateReferenceImage(id, fields);
  }
  return null;
};

const updateAll = (references: References): ToolReply | null => {
  for (const [index, entry] of (references.update ?? []).entries()) {
    const { id, ...fields } = entry;
    if (!updateReferenceImage(id, fields)) return viewFail(REFERENCES_STEP_TEXT.unknown(id), `references.update.${index}.id`);
  }
  return null;
};

const removeAll = (references: References): ToolReply | null => {
  for (const [index, id] of (references.remove ?? []).entries()) {
    if (!removeReferenceImage(id)) return viewFail(REFERENCES_STEP_TEXT.unknown(id), `references.remove.${index}`);
  }
  return null;
};

const referencesStep: ViewStep = (patch, context) => {
  const { references } = patch;
  if (!references) return null;
  if (currentViewKey() === null) return viewFail(REFERENCES_STEP_TEXT.noAsset, 'references');
  return addAll(references, context) ?? updateAll(references) ?? removeAll(references);
};

export { referencesStep };
