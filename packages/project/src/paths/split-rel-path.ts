/* @layer core @kind logic */
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import type { ProjectResult } from '../errors/project-result.type';
import { PATH_LIMITS } from './path.constants';

const textProblem = (relPath: string): string | undefined => {
  if (relPath.length === 0) return 'The path is empty.';
  if (relPath.length > PATH_LIMITS.maxLength) return `The path is longer than ${PATH_LIMITS.maxLength} characters.`;
  if (relPath.includes('\\')) return 'A path uses forward slashes only.';
  if (relPath.includes(':')) return 'A path has no colon and no drive.';
  if (relPath.startsWith('/')) return 'A path never starts with a slash.';
  return undefined;
};

const segmentProblem = (segments: readonly string[]): string | undefined => {
  if (segments.length > PATH_LIMITS.maxSegments) return `A path has at most ${PATH_LIMITS.maxSegments} segments.`;
  if (segments.some((segment) => segment === '' || segment === '.' || segment === '..')) {
    return 'A path has no empty, "." or ".." segment.';
  }
  return undefined;
};

const splitRelPath = (relPath: string): ProjectResult<readonly string[]> => {
  const problem = textProblem(relPath);
  if (problem !== undefined) return projectFail(PROJECT_ERROR_CODE.PATH_INVALID, problem);
  const segments = relPath.split('/');
  const shape = segmentProblem(segments);
  return shape === undefined ? projectOk(segments) : projectFail(PROJECT_ERROR_CODE.PATH_INVALID, shape);
};

export { splitRelPath };
