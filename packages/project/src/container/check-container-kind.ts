/* @layer core @kind logic */
import { detectAssetKind } from '@bxel/document/native';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import type { ProjectFailure } from '../errors/project-result.type';

const checkContainerKind = (bytes: Uint8Array): ProjectFailure | null => {
  const detected = detectAssetKind(bytes);
  if (detected === null) return projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_INVALID, 'The archive is not a Bxel file.');
  if (detected.kind === 'project') return null;
  const found = detected.kind === 'legacy' ? 'an older Bxel file (.bxel)' : `a Bxel ${detected.kind} file`;
  return projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_WRONG_KIND, `This is ${found}, not a project file.`);
};

export { checkContainerKind };
