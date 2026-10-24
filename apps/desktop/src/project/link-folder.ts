/* @layer renderer-app @kind logic */
import { createFolderId, isSamePath, projectFail, projectOk, PROJECT_ERROR_CODE, resolveFolders, toStoredFolderPath } from '@bxel/project';
import type { ProjectResult, ResolvedFolder } from '@bxel/project';
import { fileName } from '../files/file-name';
import { randomBytes } from '../swatch-library/random-bytes';
import { LINKED_NAME_MAX, PROJECT_TEXT } from './project.constants';
import type { LinkedFolder, OpenProject } from './project.type';

const folderLabel = (path: string): string => fileName(path.replace(/[\\/]+$/, '')).slice(0, LINKED_NAME_MAX);

const resolvedLast = (project: OpenProject, next: LinkedFolder['manifest']): ProjectResult<ResolvedFolder> => {
  const resolved = resolveFolders(next.folders, project.rootRealPath);
  const last = resolved.ok ? resolved.value.at(-1) : undefined;
  if (!resolved.ok) return resolved;
  return last ? projectOk(last) : projectFail(PROJECT_ERROR_CODE.FOLDER_INVALID, PROJECT_TEXT.linkedSame);
};

const linkFolder = (project: OpenProject, picked: string): ProjectResult<LinkedFolder> => {
  if (project.folders.some((folder) => isSamePath(folder.path, picked))) {
    return projectFail(PROJECT_ERROR_CODE.FOLDER_INVALID, PROJECT_TEXT.linkedSame);
  }
  const stored = toStoredFolderPath(project.rootRealPath, picked);
  if (!stored.ok) return stored;
  const folder = { folderId: createFolderId(randomBytes), name: folderLabel(picked), path: stored.value };
  const manifest = { ...project.manifest, folders: [...project.manifest.folders, folder] };
  const last = resolvedLast(project, manifest);
  return last.ok ? projectOk({ manifest, folder: last.value }) : last;
};

export { linkFolder };
