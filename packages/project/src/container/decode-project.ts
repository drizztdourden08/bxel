/* @layer core @kind logic */
import { readAsset } from '@bxel/document/native';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import { parseProjectDocumentValue } from '../project-document/parse-project-document-value';
import { isAssetEntry } from './asset-entry';
import { PROJECT_KIND } from './project-container.constants';
import type { DecodedProject } from './project-file.type';
import { projectFailureOf } from './project-failure-of';

const decodeProject = (bytes: Uint8Array): ProjectResult<DecodedProject> => {
  const read = readAsset(bytes, PROJECT_KIND);
  if (!read.ok) return projectFailureOf(read.issues);
  const { opened, check, json } = read.value;
  const manifest = parseProjectDocumentValue(json);
  if (!manifest.ok) return manifest;
  if (manifest.value.projectId !== opened.manifest.assetId) {
    return projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_INVALID, 'The project file and its manifest name different projects.');
  }
  const { preview, savedAt } = opened.manifest;
  return projectOk({
    manifest: manifest.value,
    preview: preview === null ? null : (check.good.get(preview) ?? null),
    assets: new Map([...check.good].filter(([path]) => isAssetEntry(path))),
    savedAt,
  });
};

export { decodeProject };
