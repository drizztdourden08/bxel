/* @layer renderer-app @kind logic */
import type { ToolHandler } from '../assistant.type';
import { editGrantRefusal } from './edit-grant-refusal';
import { previewPlan } from './preview-plan';
import { runEdits } from './run-edits';
import type { EditInput, PreviewInput } from './tool-input.type';

const previewEdits: ToolHandler = (input, context) => {
  const preview = input as PreviewInput;
  if (preview.plan !== undefined) return previewPlan(context, preview.documentId, preview.plan);
  return editGrantRefusal('preview_edits', input, context) ?? runEdits(preview as EditInput, context, 'preview', preview.render?.scale);
};

export { previewEdits };
