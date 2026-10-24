/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { joinInside } from '@bxel/project';
import type { FileKind } from '@bxel/project';
import { KNOWN_CODES } from './project-path.constants';

const projectPath = (folderPath: string, rel: string | undefined, kind?: FileKind): McpResult<string> => {
  if (rel === undefined) return { ok: true, value: folderPath };
  const joined = joinInside(folderPath, rel, kind);
  if (joined.ok) return { ok: true, value: joined.value };
  const code = KNOWN_CODES.has(joined.code) ? joined.code : MCP_ERROR_CODE.PATH_INVALID;
  return mcpFailure(code, joined.message, { path: 'path' });
};

export { projectPath };
