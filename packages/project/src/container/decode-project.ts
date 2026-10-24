/* @layer core @kind logic */
import { strFromU8 } from 'fflate';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import { parseProjectDocument } from '../project-document/parse-project-document';
import { isAssetEntry } from './asset-entry';
import { checkContainerKind } from './check-container-kind';
import { parseContainerManifest } from './parse-container-manifest';
import { CONTAINER_ENTRY } from './project-container.constants';
import type { DecodedProject } from './project-file.type';
import { readArchive } from './read-archive';
import { verifyContainerEntries } from './verify-container-entries';

const decodeProject = (bytes: Uint8Array): ProjectResult<DecodedProject> => {
  const archive = readArchive(bytes);
  if (!archive.ok) return archive;
  const wrong = checkContainerKind(bytes);
  if (wrong) return wrong;
  const container = parseContainerManifest(archive.value);
  if (!container.ok) return container;
  const good = verifyContainerEntries(container.value, archive.value);
  if (!good.ok) return good;
  const document = good.value.get(CONTAINER_ENTRY.document);
  if (!document) return projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_INVALID, 'The project file has no project.json.');
  const manifest = parseProjectDocument(strFromU8(document));
  if (!manifest.ok) return manifest;
  if (manifest.value.projectId !== container.value.assetId) {
    return projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_INVALID, 'The project file and its manifest name different projects.');
  }
  const assets = new Map([...good.value].filter(([path]) => isAssetEntry(path)));
  return projectOk({
    manifest: manifest.value,
    preview: good.value.get(CONTAINER_ENTRY.preview) ?? null,
    assets,
    savedAt: container.value.savedAt,
  });
};

export { decodeProject };
