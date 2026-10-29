/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import type { OpenProject } from '../../project/project.type';
import { entryKindAt } from './entry-kind-at';
import { placePath } from './place-path';
import type { FilePlace } from './project-files-input.type';
import { TOOL_TEXT } from './tools.constants';

type Entry = { readonly path: string; readonly folder: boolean };

/** The files and folders a call names, as full paths that exist. A folder id and path that lead nowhere fail the whole call. */
const resolveEntries = async (context: ToolContext, project: OpenProject, places: readonly FilePlace[], field: string): Promise<McpResult<readonly Entry[]>> => {
  const entries: Entry[] = [];
  for (const [at, place] of places.entries()) {
    const path = placePath(project, place, `${field}.${at}`);
    if (!path.ok) return path;
    const kind = await entryKindAt(context.documents, path.value);
    if (kind === null) return mcpFailure(MCP_ERROR_CODE.FILE_NOT_FOUND, TOOL_TEXT.noEntry, { path: `${field}.${at}.path` });
    entries.push({ path: path.value, folder: kind === 'folder' });
  }
  return { ok: true, value: entries };
};

export { resolveEntries };
export type { Entry };
