/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import type { OpenProject } from './project.type';

const unique = (paths: readonly string[]): readonly string[] =>
  paths.filter((path, index) => paths.findIndex((other) => isSamePath(other, path)) === index);

const releaseFolders = async (documents: DocumentsPort, project: Pick<OpenProject, 'rootRealPath' | 'folders'>): Promise<void> => {
  const paths = unique([project.rootRealPath, ...project.folders.map((folder) => folder.path)]);
  await Promise.all(paths.map((path) => documents.revokeFolder(path).catch(() => false)));
};

export { releaseFolders };
