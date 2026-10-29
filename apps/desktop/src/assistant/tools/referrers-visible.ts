/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import { referrerPaths } from '../../file-ops/referrer-paths';
import type { OpenProject } from '../../project/project.type';
import { locateInProject } from './locate-in-project';
import { TOOL_TEXT } from './tools.constants';

/** The files whose links a change would rewrite or break must all be files the assistant may see. Returns the failure when one is not. */
const referrersVisible = (visible: OpenProject, paths: readonly string[]): Failure | null =>
  referrerPaths(paths).some((path) => locateInProject(visible, path) === null) ? mcpFailure(MCP_ERROR_CODE.PATH_NOT_ALLOWED, TOOL_TEXT.referrersHidden) : null;

export { referrersVisible };
