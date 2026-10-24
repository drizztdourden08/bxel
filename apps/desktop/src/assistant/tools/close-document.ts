/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { ToolHandler } from '../assistant.type';
import { reply } from './reply';
import type { CloseInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';

const closeDocument: ToolHandler = (input, context) => {
  const { documentId, discard } = input as CloseInput;
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  if (!view.clean && !discard) return reply(mcpFailure(MCP_ERROR_CODE.UNSAVED_CHANGES, TOOL_TEXT.unsaved));
  const closed = context.host.close(documentId as DocumentId);
  return reply({ ok: true, closed, discarded: closed && !view.clean });
};

export { closeDocument };
