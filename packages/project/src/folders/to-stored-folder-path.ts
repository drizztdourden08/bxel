/* @layer core @kind logic */
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import type { ProjectResult } from '../errors/project-result.type';
import { normalizeAbsolute } from '../paths/normalize-absolute';
import { splitPrefix } from '../paths/split-prefix';
import { relativePath } from './relative-path';

const driveKey = (normalized: string): string => splitPrefix(normalized)?.prefix.toLowerCase() ?? '';

const toStoredFolderPath = (rootRealPath: string, folderRealPath: string): ProjectResult<string> => {
  const root = normalizeAbsolute(rootRealPath);
  const folder = normalizeAbsolute(folderRealPath);
  if (root === undefined || folder === undefined) {
    return projectFail(PROJECT_ERROR_CODE.FOLDER_INVALID, 'A folder path is absolute before it is stored.');
  }
  return projectOk(driveKey(root) === driveKey(folder) ? relativePath(root, folder) : folder);
};

export { toStoredFolderPath };
