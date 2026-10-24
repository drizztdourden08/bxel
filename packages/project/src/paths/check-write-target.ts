/* @layer core @kind logic */
import { projectFail } from '../errors/project-fail';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import type { ProjectResult } from '../errors/project-result.type';
import { checkSegments } from './check-segments';
import { hasExtension } from './has-extension';
import { isReservedFile } from './is-reserved-file';
import { FILE_EXTENSIONS } from './path.constants';
import type { FileKind } from './path.type';
import { splitRelPath } from './split-rel-path';

const checkWriteTarget = (relPath: string, kind: FileKind): ProjectResult<readonly string[]> => {
  const split = splitRelPath(relPath);
  if (!split.ok) return split;
  const last = split.value.at(-1) ?? '';
  if (isReservedFile(last)) {
    return projectFail(PROJECT_ERROR_CODE.PATH_NOT_ALLOWED, `"${last}" is a reserved file and is never written.`);
  }
  const named = checkSegments(split.value);
  if (!named.ok) return named;
  if (hasExtension(last, kind)) return named;
  const wanted = FILE_EXTENSIONS[kind].map((extension) => `.${extension}`).join(' or ');
  return projectFail(PROJECT_ERROR_CODE.NAME_INVALID, `"${last}" needs the extension ${wanted}.`);
};

export { checkWriteTarget };
