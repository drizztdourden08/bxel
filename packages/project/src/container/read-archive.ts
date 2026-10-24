/* @layer core @kind logic */
import { unzipSync } from 'fflate';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import type { Listed } from './read-archive.type';
import { CONTAINER_LIMITS, ZIP_SIGNATURE } from './project-container.constants';

const hasZipSignature = (bytes: Uint8Array): boolean => ZIP_SIGNATURE.every((byte, index) => bytes[index] === byte);

const listEntries = (bytes: Uint8Array): readonly Listed[] | null => {
  const listed: Listed[] = [];
  try {
    unzipSync(bytes, {
      filter: (file) => {
        listed.push({ name: file.name, size: file.originalSize });
        return false;
      },
    });
    return listed;
  } catch {
    return null;
  }
};

const tooLarge = (listed: readonly Listed[]): boolean =>
  listed.some((entry) => entry.size > CONTAINER_LIMITS.maxEntryBytes) ||
  listed.reduce((total, entry) => total + entry.size, 0) > CONTAINER_LIMITS.maxTotalBytes;

const readArchive = (bytes: Uint8Array): ProjectResult<ReadonlyMap<string, Uint8Array>> => {
  if (bytes.length > CONTAINER_LIMITS.maxFileBytes) {
    return projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_TOO_LARGE, 'The project file is larger than the file limit.');
  }
  if (!hasZipSignature(bytes)) return projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_INVALID, 'The file is not a zip archive.');
  const listed = listEntries(bytes);
  if (listed === null) {
    return projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_INVALID, 'The archive is cut short or its directory is damaged.');
  }
  if (tooLarge(listed)) return projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_TOO_LARGE, 'The project file holds more than the limits allow.');
  try {
    const files = unzipSync(bytes, { filter: (file) => !file.name.endsWith('/') });
    return projectOk(new Map(Object.entries(files)));
  } catch {
    return projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_INVALID, 'An entry of the archive cannot be inflated.');
  }
};

export { readArchive };
