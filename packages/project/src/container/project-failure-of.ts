/* @layer core @kind logic */
import type { LoadIssue } from '@bxel/document/native';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import type { ProjectFailure } from '../errors/project-result.type';
import { FAILURE_CODE_OF } from './project-container.constants';

const projectFailureOf = (issues: readonly LoadIssue[]): ProjectFailure => {
  const first = issues[0];
  const code = (first && FAILURE_CODE_OF[first.code]) ?? PROJECT_ERROR_CODE.PROJECT_FILE_INVALID;
  return projectFail(
    code,
    first?.message ?? 'The project file is damaged.',
    issues.map((issue) => ({ path: issue.path ?? '', message: issue.message })),
  );
};

export { projectFailureOf };
