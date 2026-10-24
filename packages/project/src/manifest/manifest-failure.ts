/* @layer core @kind logic */
import type { ZodError } from 'zod';
import { projectFail } from '../errors/project-fail';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import type { ProjectFailure } from '../errors/project-result.type';

const manifestFailure = (error: ZodError): ProjectFailure =>
  projectFail(
    PROJECT_ERROR_CODE.MANIFEST_INVALID,
    'The manifest breaks the bxel-project format.',
    error.issues.map((issue) => ({ path: issue.path.map(String).join('.'), message: issue.message })),
  );

export { manifestFailure };
