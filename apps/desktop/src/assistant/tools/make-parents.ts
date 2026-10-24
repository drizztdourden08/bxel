/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import { isSamePath } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { reasonOf } from '../../files/reason-of';
import { TOOL_TEXT } from './tools.constants';

const makeParents = async (documents: DocumentsPort, folder: string, path: string): Promise<Failure | null> => {
  const parent = path.slice(0, path.lastIndexOf('/'));
  if (isSamePath(parent, folder)) return null;
  try {
    await documents.mkdir(parent, { recursive: true });
    return null;
  } catch (error) {
    return mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, TOOL_TEXT.writeRefused(reasonOf(error)), { path: 'location.path' });
  }
};

export { makeParents };
