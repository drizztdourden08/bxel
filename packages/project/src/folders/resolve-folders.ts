/* @layer core @kind logic */
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import type { ProjectResult } from '../errors/project-result.type';
import type { ProjectFolder } from '../manifest/manifest.type';
import { normalizeAbsolute } from '../paths/normalize-absolute';
import { PATH_LIMITS } from '../paths/path.constants';
import { findNested } from './find-nested';
import type { ResolvedFolder } from './folder.type';
import { resolveFolderPath } from './resolve-folder-path';

const resolveFolders = (
  folders: readonly ProjectFolder[],
  rootRealPath: string,
): ProjectResult<readonly ResolvedFolder[]> => {
  if (folders.length > PATH_LIMITS.maxFolders) {
    return projectFail(PROJECT_ERROR_CODE.TOO_MANY_FOLDERS, `A project has at most ${PATH_LIMITS.maxFolders} folders.`);
  }
  const root = normalizeAbsolute(rootRealPath);
  if (root === undefined) return projectFail(PROJECT_ERROR_CODE.FOLDER_INVALID, 'The root folder is not an absolute path.');
  const resolved: ResolvedFolder[] = [];
  for (const folder of folders) {
    const path = resolveFolderPath(root, folder.path);
    if (path === undefined) {
      return projectFail(PROJECT_ERROR_CODE.FOLDER_INVALID, `The folder "${folder.name}" has a path that does not resolve.`);
    }
    resolved.push({ folderId: folder.folderId, name: folder.name, path });
  }
  const nested = findNested(resolved.map((folder) => folder.path));
  if (nested === undefined) return projectOk(resolved);
  const [first, second] = nested;
  return projectFail(
    PROJECT_ERROR_CODE.FOLDER_NESTED,
    `"${resolved[first]?.name ?? ''}" and "${resolved[second]?.name ?? ''}" overlap: no folder sits inside another.`,
  );
};

export { resolveFolders };
