/* @layer renderer-app @kind logic */
import { canSee, hiddenFailure, MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { hiddenCover } from './hidden-cover';
import { insideCover } from './inside-cover';
import { isOpenablePath } from './is-openable-path';
import { recentIdOf } from './recent-id-of';
import type { OpenTarget } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { visibleRecent } from './visible-recent';

const openPaths = (context: ToolContext): readonly string[] => {
  if (!canSee(context.settings.assistantSee, 'open_document')) return [];
  const cover = hiddenCover(context);
  return context.host.list().flatMap((documentId) => {
    const path = context.paths.pathOf(documentId);
    return path === undefined || insideCover(cover, path) ? [] : [path];
  });
};

const recentTarget = async (context: ToolContext, recentId: string): Promise<McpResult<OpenTarget>> => {
  const recent = (await visibleRecent(context)).map((entry) => entry.path);
  const listed = recent.find((path) => recentIdOf(path) === recentId);
  const path = listed ?? openPaths(context).find((each) => recentIdOf(each) === recentId);
  if (path === undefined) return hiddenFailure('file');
  if (!isOpenablePath(path)) return mcpFailure(MCP_ERROR_CODE.FILE_NOT_SUPPORTED, TOOL_TEXT.notBxel);
  return { ok: true, value: { path, viaRecent: listed !== undefined } };
};

export { recentTarget };
