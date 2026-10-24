/* @layer core @kind types */
import type { PROJECT_ERROR_CODE } from './project-error.constants';

type ProjectErrorCode = (typeof PROJECT_ERROR_CODE)[keyof typeof PROJECT_ERROR_CODE];

type ProjectIssue = {
  readonly path: string;
  readonly message: string;
};

type ProjectFailure = {
  readonly ok: false;
  readonly code: ProjectErrorCode;
  readonly message: string;
  readonly issues: readonly ProjectIssue[];
};

type ProjectResult<T> = { readonly ok: true; readonly value: T } | ProjectFailure;

export type { ProjectErrorCode, ProjectFailure, ProjectIssue, ProjectResult };
