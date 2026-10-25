/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { pathOwner } from './path-owner';
import { TOOL_TEXT } from './tools.constants';

const checkPathFree = (context: ToolContext, path: string, saving: { readonly documentId: DocumentId; readonly id: string }): Failure | null => {
  const owner = pathOwner(context, path);
  if (!owner || (owner.documentId === saving.documentId && (owner.id === null || owner.id === saving.id))) return null;
  return mcpFailure(MCP_ERROR_CODE.FILE_IN_USE, TOOL_TEXT.fileInUse, { path: 'target' });
};

export { checkPathFree };
