/* @layer renderer-app @kind logic */
import type { ToolHandler } from '../assistant.type';
import { editGrantRefusal } from './edit-grant-refusal';
import { runEdits } from './run-edits';
import type { EditInput } from './tool-input.type';

const previewEdits: ToolHandler = (input, context) => editGrantRefusal('preview_edits', input, context) ?? runEdits(input as EditInput, context, 'preview');

export { previewEdits };
