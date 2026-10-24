/* @layer core @kind logic */
import { crc32 } from '@bxel/document/native';
import { PROJECT_ERROR_CODE } from '../errors/project-error.constants';
import { projectFail } from '../errors/project-fail';
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import type { ContainerManifest } from './container-manifest.type';
import type { ContainerEntry } from './verify-container-entries.type';
import { CONTAINER_ENTRY } from './project-container.constants';

const problemOf = (entry: ContainerEntry, bytes: Uint8Array | undefined): string | null => {
  if (!bytes) return `${entry.path} is listed but missing.`;
  if (bytes.length !== entry.length) return `${entry.path} has ${bytes.length} bytes, expected ${entry.length}.`;
  return crc32(bytes) === entry.crc32 ? null : `${entry.path} fails its checksum.`;
};

const verifyContainerEntries = (
  manifest: ContainerManifest,
  archive: ReadonlyMap<string, Uint8Array>,
): ProjectResult<ReadonlyMap<string, Uint8Array>> => {
  const good = new Map<string, Uint8Array>();
  const issues: { path: string; message: string }[] = [];
  for (const entry of manifest.entries) {
    const bytes = archive.get(entry.path);
    const problem = problemOf(entry, bytes);
    if (problem === null && bytes) good.set(entry.path, bytes);
    else if (entry.path !== CONTAINER_ENTRY.preview) issues.push({ path: entry.path, message: problem ?? '' });
  }
  return issues.length === 0
    ? projectOk(good)
    : projectFail(PROJECT_ERROR_CODE.PROJECT_FILE_INVALID, 'The project file is damaged.', issues);
};

export { verifyContainerEntries };
