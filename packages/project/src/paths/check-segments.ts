/* @layer core @kind logic */
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import type { ProjectResult } from '../errors/project-result.type';
import { isValidSegment } from './is-valid-segment';

const checkSegments = (segments: readonly string[]): ProjectResult<readonly string[]> => {
  const bad = segments.find((segment) => !isValidSegment(segment));
  return bad === undefined
    ? projectOk(segments)
    : projectFail(PROJECT_ERROR_CODE.NAME_INVALID, `"${bad}" breaks the file name rule.`);
};

export { checkSegments };
