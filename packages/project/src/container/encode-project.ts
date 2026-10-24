/* @layer core @kind logic */
import type { Clock } from '@bxel/document/native';
import { writeAssetContainer } from '@bxel/document/native';
import { strToU8 } from 'fflate';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import { writeProjectDocument } from '../project-document/write-project-document';
import { isAssetEntry } from './asset-entry';
import { PROJECT_KIND } from './project-container.constants';
import type { ProjectFileInput } from './project-file.type';

const sortedAssets = (assets: ReadonlyMap<string, Uint8Array>): ReadonlyMap<string, Uint8Array> =>
  new Map([...assets].sort(([left], [right]) => (left < right ? -1 : 1)));

const encodeProject = (input: ProjectFileInput, clock: Clock): ProjectResult<Uint8Array> => {
  const written = writeProjectDocument(input.manifest);
  if (!written.ok) return written;
  const stray = [...input.assets.keys()].find((entry) => !isAssetEntry(entry));
  if (stray !== undefined) {
    return projectFail(PROJECT_ERROR_CODE.PATH_INVALID, `"${stray}" is not a packed asset path.`);
  }
  const { projectId, name } = input.manifest;
  return projectOk(
    writeAssetContainer({
      header: { kind: PROJECT_KIND, id: projectId, name, links: [] },
      savedAt: clock(),
      documentBytes: strToU8(written.value),
      preview: input.preview,
      blobs: sortedAssets(input.assets),
    }),
  );
};

export { encodeProject };
