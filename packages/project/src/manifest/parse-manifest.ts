/* @layer core @kind logic */
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import type { ProjectResult } from '../errors/project-result.type';
import { manifestFailure } from './manifest-failure';
import { manifestSchema } from './manifest-schema';
import type { ProjectManifest } from './manifest.type';

const parseManifest = (text: string): ProjectResult<ProjectManifest> => {
  let value: unknown;
  try {
    value = JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);
  } catch {
    return projectFail(PROJECT_ERROR_CODE.MANIFEST_INVALID, 'The manifest is not valid JSON.');
  }
  const parsed = manifestSchema.safeParse(value);
  return parsed.success ? projectOk(parsed.data) : manifestFailure(parsed.error);
};

export { parseManifest };
