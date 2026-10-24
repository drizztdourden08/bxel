/* @layer core @kind logic */
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';

const parseJsonText = (text: string): ProjectResult<unknown> => {
  try {
    return projectOk(JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text) as unknown);
  } catch {
    return projectFail(PROJECT_ERROR_CODE.MANIFEST_INVALID, 'The manifest is not valid JSON.');
  }
};

export { parseJsonText };
