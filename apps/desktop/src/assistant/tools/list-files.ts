/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { ENTRY_KINDS, joinInside } from '@bxel/project';
import type { ListedEntry } from '@bxel/project';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { listFolderEntries } from '../../project/list-folder-entries';
import { documentAt } from './document-at';
import { projectFolder } from './project-folder';
import { projectPath } from './project-path';
import { reply } from './reply';
import type { ListFilesInput } from './tool-input.type';
import { TOOL_TEXT, WIRE_KIND_OF } from './tools.constants';

const wireEntry = (context: ToolContext, dir: string, entry: ListedEntry) => {
  if (entry.kind === 'folder') return { name: entry.name, kind: entry.kind };
  const path = joinInside(dir, entry.name);
  return {
    name: entry.name,
    kind: WIRE_KIND_OF[entry.kind],
    bytes: entry.bytes,
    modifiedAt: new Date(entry.modified).toISOString(),
    documentId: path.ok ? documentAt(context, path.value) : null,
  };
};

const listFiles: ToolHandler = async (input, context) => {
  const request = input as ListFilesInput;
  const found = projectFolder(context, request.projectId, request.folderId);
  if (!found.ok) return reply(found);
  const dir = projectPath(found.value.folder.path, request.path);
  if (!dir.ok) return reply(dir);
  try {
    const kinds = ENTRY_KINDS.filter((kind) => request.kinds.includes(WIRE_KIND_OF[kind]));
    const listing = await listFolderEntries(context.documents, dir.value, { ...request, kinds });
    return reply({
      ok: true,
      path: request.path ?? '',
      entries: listing.entries.map((entry) => wireEntry(context, dir.value, entry)),
      total: listing.total,
      skipped: listing.skipped,
      truncated: listing.truncated || listing.cut,
    });
  } catch {
    return reply(mcpFailure(MCP_ERROR_CODE.FOLDER_NOT_FOUND, TOOL_TEXT.folderUnreadable, { path: 'path' }));
  }
};

export { listFiles };
