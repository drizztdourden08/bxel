/* @layer core @kind logic */
import type { ProjectResult } from '../errors/project-result.type';
import { checkSegments } from './check-segments';
import { splitRelPath } from './split-rel-path';

const checkRelPath = (relPath: string): ProjectResult<readonly string[]> => {
  const split = splitRelPath(relPath);
  return split.ok ? checkSegments(split.value) : split;
};

export { checkRelPath };
