/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { listProjectFiles } from '../asset-list/list-project-files';
import { reasonOf } from '../files/reason-of';
import { grantedFolders } from '../project/granted-folders';
import type { OpenProject, ProjectFolderState } from '../project/project.type';
import type { DiskOutcome } from './project-manager.type';
import { readDiskManifest } from './read-disk-manifest';
import { readFilePreviews } from './read-file-previews';

const holds = (inUse: readonly OpenProject[], path: string): boolean =>
  inUse.some((project) => [project.rootRealPath, ...project.folders.map((folder) => folder.path)].some((each) => isSamePath(each, path)));

const release = async (documents: DocumentsPort, paths: readonly string[], inUse: readonly OpenProject[]): Promise<void> => {
  const spare = paths.filter((path, at) => !holds(inUse, path) && paths.findIndex((other) => isSamePath(other, path)) === at);
  await Promise.all(spare.map((path) => documents.revokeFolder(path).catch(() => false)));
};

const inspectProject = async (documents: DocumentsPort, folder: string, inUse: readonly OpenProject[]): Promise<DiskOutcome> => {
  const read = await readDiskManifest(documents, folder).catch((error: unknown) => ({ ok: false as const, message: reasonOf(error) }));
  if (!read.ok) {
    await release(documents, [folder], inUse);
    return read;
  }
  const { root, manifest, projectFile, folders } = read.value;
  const reached: readonly ProjectFolderState[] = await grantedFolders(documents, root, folders);
  try {
    const files = await listProjectFiles(documents, { folders: reached });
    const previews = await readFilePreviews(documents, files);
    return { ok: true, project: { manifest, projectFile, folders, files, previews } };
  } catch (error) {
    return { ok: false, message: reasonOf(error) };
  } finally {
    await release(documents, [root, ...reached.map((each) => each.path)], inUse);
  }
};

export { inspectProject };
