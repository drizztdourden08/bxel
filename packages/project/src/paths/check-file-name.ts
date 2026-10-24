/* @layer core @kind logic */
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import type { ProjectResult } from '../errors/project-result.type';
import { checkWriteTarget } from './check-write-target';
import type { FileKind } from './path.type';

const checkFileName = (name: string, kind: FileKind): ProjectResult<string> => {
  if (name.includes('/') || name.includes('\\')) {
    return projectFail(PROJECT_ERROR_CODE.NAME_INVALID, 'A file name has no folder part.');
  }
  const checked = checkWriteTarget(name, kind);
  if (checked.ok) return projectOk(name);
  return checked.code === PROJECT_ERROR_CODE.PATH_INVALID
    ? projectFail(PROJECT_ERROR_CODE.NAME_INVALID, checked.message)
    : checked;
};

export { checkFileName };
