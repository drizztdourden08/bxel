/* @layer renderer-app @kind logic */
import { decodeProject, PROJECT_ERROR_CODE, projectFail, projectOk } from '@bxel/project';
import type { ProjectResult } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { PROJECT_TEXT } from './project.constants';
import type { LoadedManifest } from './project.type';

const readProjectFile = async (documents: DocumentsPort, path: string): Promise<ProjectResult<LoadedManifest>> => {
  const decoded = decodeProject(await documents.read(path));
  if (!decoded.ok) return decoded;
  if (decoded.value.assets.size > 0) return projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_INVALID, PROJECT_TEXT.packed);
  const { manifest, preview } = decoded.value;
  return projectOk({ manifest, projectFile: path, preview, migrated: false });
};

export { readProjectFile };
