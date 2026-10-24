/* @layer renderer-app @kind logic */
import { parseManifest, PROJECT_ERROR_CODE, projectFail, projectOk } from '@bxel/project';
import type { ProjectResult } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { findManifestFile } from './find-manifest-file';
import { PROJECT_TEXT } from './project.constants';
import type { LoadedManifest } from './project.type';

const readProjectFolder = async (documents: DocumentsPort, folder: string): Promise<ProjectResult<LoadedManifest>> => {
  const found = await findManifestFile(documents, folder);
  if (found === null) return projectFail(PROJECT_ERROR_CODE.MANIFEST_INVALID, PROJECT_TEXT.noManifest);
  const parsed = parseManifest(await documents.readText(found.path));
  return parsed.ok ? projectOk({ manifest: parsed.value, manifestPath: found.path }) : parsed;
};

export { readProjectFolder };
