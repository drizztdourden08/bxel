/* @layer renderer-app @kind logic */
import type { ToolHandler } from '../assistant.type';
import { editGrantRefusal } from './edit-grant-refusal';
import { runEdits } from './run-edits';
import type { PreviewInput } from './tool-input.type';

const previewEdits: ToolHandler = (input, context) => {
  const preview = input as PreviewInput;
  return editGrantRefusal('preview_edits', input, context) ?? runEdits(preview, context, 'preview', preview.render?.scale);
};

export { previewEdits };
