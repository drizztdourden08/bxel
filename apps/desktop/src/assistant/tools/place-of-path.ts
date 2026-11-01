/* @layer renderer-app @kind logic */
import { canSeeFolder } from '@bxel/mcp';
import { checkRelPath, relativeInside } from '@bxel/project';
import type { OpenProject } from '../../project/project.type';

type PathPlace = { readonly projectId: string; readonly folderId: string; readonly path?: string };

const placeOfPath = (project: OpenProject | null, path: string): PathPlace | null => {
  if (project === null) return null;
  for (const folder of project.folders) {
    const rel = relativeInside(folder.path, path);
    if (rel === undefined || !canSeeFolder(project.manifest.assistant.folders, folder.folderId)) continue;
    const base = { projectId: project.manifest.projectId, folderId: folder.folderId };
    if (rel === '') return base;
    if (checkRelPath(rel).ok) return { ...base, path: rel };
  }
  return null;
};

export type { PathPlace };
export { placeOfPath };
