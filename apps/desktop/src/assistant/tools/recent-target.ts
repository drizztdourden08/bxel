/* @layer renderer-app @kind logic */
import { hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { isArtworkPath } from '../../files/is-artwork-path';
import type { ToolContext } from '../assistant.type';
import { recentIdOf } from './recent-id-of';
import type { OpenTarget } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { visibleRecent } from './visible-recent';

const recentTarget = async (context: ToolContext, recentId: string): Promise<McpResult<OpenTarget>> => {
  const entry = (await visibleRecent(context)).find((recent) => recentIdOf(recent.path) === recentId);
  if (!entry) return hiddenFailure('file');
  if (!isArtworkPath(entry.path)) return mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, TOOL_TEXT.notBxel);
  return { ok: true, value: { path: entry.path, viaRecent: true } };
};

export { recentTarget };
