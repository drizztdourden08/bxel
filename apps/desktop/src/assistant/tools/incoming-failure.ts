/* @layer renderer-app @kind logic */
import type { ToolReply } from '@bxel/mcp';
import { APP_TOOL_TEXT } from './app-tool.constants';
import type { Shape } from './selection-step.type';
import { viewFail } from './view-fail';

const incomingFailure = (shape: Shape, incoming: 'outside' | 'missing' | 'resized'): ToolReply => {
  if (incoming === 'outside') return viewFail(APP_TOOL_TEXT.wandOutside, 'selection.shape');
  const name = shape.kind === 'saved' ? shape.name : '';
  return viewFail(incoming === 'missing' ? APP_TOOL_TEXT.noSavedSelection(name) : APP_TOOL_TEXT.savedResized(name), 'selection.shape');
};

export { incomingFailure };
