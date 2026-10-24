/* @layer core @kind logic */
import type { Clock } from '@bxel/document/native';
import { strToU8, zipSync } from 'fflate';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import { writeProjectDocument } from '../project-document/write-project-document';
import { isAssetEntry } from './asset-entry';
import { buildProjectZippable } from './build-project-zippable';
import { ZIP_MTIME } from './project-container.constants';
import type { ProjectFileInput } from './project-file.type';

const encodeProject = (input: ProjectFileInput, clock: Clock): ProjectResult<Uint8Array> => {
  const written = writeProjectDocument(input.manifest);
  if (!written.ok) return written;
  const stray = [...input.assets.keys()].find((entry) => !isAssetEntry(entry));
  if (stray !== undefined) {
    return projectFail(PROJECT_ERROR_CODE.PATH_INVALID, `"${stray}" is not a packed asset path.`);
  }
  const zippable = buildProjectZippable({
    project: input.manifest,
    savedAt: clock(),
    documentBytes: strToU8(written.value),
    preview: input.preview,
    assets: input.assets,
  });
  return projectOk(zipSync(zippable, { mtime: ZIP_MTIME }));
};

export { encodeProject };
