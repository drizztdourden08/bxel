/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import type { DocumentWriteOptions } from '@drizztdourden08/brock-core';
import { reasonOf } from '../../files/reason-of';
import type { ToolContext } from '../assistant.type';
import { TOOL_TEXT } from './tools.constants';

const writeProjectFile = async (
  context: ToolContext,
  path: string,
  bytes: Uint8Array,
  options?: DocumentWriteOptions,
): Promise<Failure | null> => {
  try {
    await context.documents.write(path, bytes, options);
    return null;
  } catch (error) {
    return mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, TOOL_TEXT.writeRefused(reasonOf(error)), { path: 'location.path' });
  }
};

export { writeProjectFile };
