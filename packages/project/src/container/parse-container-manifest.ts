/* @layer core @kind logic */
import { strFromU8 } from 'fflate';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import { containerManifestSchema } from './container-manifest-schema';
import type { ContainerManifest } from './container-manifest.type';
import { CONTAINER_ENTRY, CONTAINER_VERSION } from './project-container.constants';

const invalid = (message: string): ProjectResult<ContainerManifest> =>
  projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_INVALID, message);

const parseContainerManifest = (archive: ReadonlyMap<string, Uint8Array>): ProjectResult<ContainerManifest> => {
  const bytes = archive.get(CONTAINER_ENTRY.manifest);
  if (!bytes) return invalid('The project file has no manifest.json.');
  let json: unknown;
  try {
    json = JSON.parse(strFromU8(bytes));
  } catch {
    return invalid('The manifest.json of the project file is not valid JSON.');
  }
  const parsed = containerManifestSchema.safeParse(json);
  if (!parsed.success) return invalid('The manifest.json of the project file breaks the Bxel container format.');
  if (parsed.data.minReaderVersion > CONTAINER_VERSION) {
    return projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_TOO_NEW, 'This project file was saved by a newer Bxel. Update Bxel to open it.');
  }
  return projectOk(parsed.data);
};

export { parseContainerManifest };
