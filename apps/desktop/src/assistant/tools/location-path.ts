/* @layer renderer-app @kind logic */
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import type { LocationLike } from './location-path.type';
import { placePath } from './place-path';
import { projectFolder } from './project-folder';

const locationPath = (context: ToolContext, place: LocationLike, field: string): McpResult<string> => {
  const found = projectFolder(context, place.projectId, place.folderId);
  if (!found.ok) return { ok: false, error: { ...found.error, path: `${field}.folderId` } };
  return placePath(found.value.project, place, field);
};

export { locationPath };
