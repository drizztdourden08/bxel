/* @layer renderer-app @kind logic */
import type { McpResult } from '@bxel/mcp';
import { isOpenablePath } from './is-openable-path';
import type { ToolContext } from '../assistant.type';
import { locatedPath } from './located-path';
import type { OpenTarget, ProjectLocation } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const projectTarget = async (context: ToolContext, location: ProjectLocation): Promise<McpResult<OpenTarget>> => {
  const path = await locatedPath(context, location, isOpenablePath, TOOL_TEXT.notBxel);
  if (!path.ok) return path;
  return { ok: true, value: { path: path.value, viaRecent: false } };
};

export { projectTarget };
