/* @layer renderer-app @kind logic */
import { isManifestFile, PROJECT_ERROR_CODE, projectFail } from '@bxel/project';
import type { ProjectResult } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { findManifestFile } from './find-manifest-file';
import { migrateProject } from './migrate-project';
import { PROJECT_TEXT } from './project.constants';
import type { LoadedManifest } from './project.type';
import { readProjectFile } from './read-project-file';

const readProjectFolder = async (documents: DocumentsPort, folder: string): Promise<ProjectResult<LoadedManifest>> => {
  const found = await findManifestFile(documents, folder);
  if (found === null) return projectFail(PROJECT_ERROR_CODE.MANIFEST_INVALID, PROJECT_TEXT.noManifest);
  return isManifestFile(found.name) ? migrateProject(documents, folder, found) : readProjectFile(documents, found.path);
};

export { readProjectFolder };
