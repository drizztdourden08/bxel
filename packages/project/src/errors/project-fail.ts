/* @layer core @kind logic */
import type { ProjectErrorCode, ProjectFailure, ProjectIssue } from './project-result.type';

const projectFail = (
  code: ProjectErrorCode,
  message: string,
  issues: readonly ProjectIssue[] = [],
): ProjectFailure => ({ ok: false, code, message, issues });

export { projectFail };
