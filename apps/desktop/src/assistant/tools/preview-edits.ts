/* @layer renderer-app @kind logic */
import type { ToolHandler } from '../assistant.type';
import { runEdits } from './run-edits';
import type { EditInput } from './tool-input.type';

const previewEdits: ToolHandler = (input, context) => runEdits(input as EditInput, context, 'preview');

export { previewEdits };
