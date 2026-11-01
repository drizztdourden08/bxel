/* @layer renderer-app @kind logic */
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import { ENTRY_KINDS, joinInside } from '@bxel/project';
import type { ListedEntry } from '@bxel/project';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { documentAt } from './document-at';
import { listFileTree } from './list-file-tree';
import { projectFolder } from './project-folder';
import { projectPath } from './project-path';
import { reply } from './reply';
import type { ListFilesInput } from './tool-input.type';
import { TOOL_TEXT, WIRE_KIND_OF } from './tools.constants';

const wireEntry = (context: ToolContext, dir: string, entry: ListedEntry, path: string, depth: number) => {
  if (entry.kind === 'folder') return { name: entry.name, kind: entry.kind, path, depth };
  const full = joinInside(dir, entry.name);
  return {
    name: entry.name,
    kind: WIRE_KIND_OF[entry.kind],
    path,
    depth,
    bytes: entry.bytes,
    modifiedAt: new Date(entry.modified).toISOString(),
    documentId: full.ok ? documentAt(context, full.value) : null,
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
    const tree = await listFileTree({ documents: context.documents, kinds, depth: request.depth }, dir.value);
    const page = tree.entries.slice(request.offset, request.offset + request.limit);
    return reply({
      ok: true,
      path: request.path ?? '',
      entries: page.map(({ entry, dir: where, path, depth }) => wireEntry(context, where, entry, path, depth)),
      total: tree.entries.length,
      skipped: tree.skipped,
      truncated: tree.cut || request.offset + page.length < tree.entries.length,
    });
  } catch {
    return reply(mcpFailure(MCP_ERROR_CODE.FOLDER_NOT_FOUND, TOOL_TEXT.folderUnreadable, { path: 'path' }));
  }
};

export { listFiles };
