/* @layer renderer-app @kind logic */
import type { ToolHandler } from '../assistant.type';
import { runEdits } from './run-edits';
import type { PreviewInput } from './tool-input.type';

const previewEdits: ToolHandler = (input, context) => {
  const preview = input as PreviewInput;
  return runEdits(preview, context, 'preview', preview.render?.scale);
};

export { previewEdits };
