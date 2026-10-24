/* @layer core @kind logic */
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import type { ProjectResult } from '../errors/project-result.type';
import { checkRelPath } from './check-rel-path';
import { checkWriteTarget } from './check-write-target';
import { isInside } from './is-inside';
import { normalizeAbsolute } from './normalize-absolute';
import type { FileKind } from './path.type';

const joinInside = (folderRealPath: string, relPath: string, kind?: FileKind): ProjectResult<string> => {
  const base = normalizeAbsolute(folderRealPath);
  if (base === undefined) {
    return projectFail(PROJECT_ERROR_CODE.PATH_INVALID, 'The folder is not an absolute path.');
  }
  const checked = kind === undefined ? checkRelPath(relPath) : checkWriteTarget(relPath, kind);
  if (!checked.ok) return checked;
  const joined = `${base.replace(/\/$/, '')}/${checked.value.join('/')}`;
  return isInside(joined, base)
    ? projectOk(joined)
    : projectFail(PROJECT_ERROR_CODE.PATH_NOT_ALLOWED, 'The path leaves its folder.');
};

export { joinInside };
