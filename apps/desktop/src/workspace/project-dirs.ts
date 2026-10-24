/* @layer renderer-app @kind logic */
import type { OpenProject } from '../project/project.type';
import { roleDirs } from './role-dirs';
import type { AssetDirs } from './workspace.type';

const projectDirs = (project: OpenProject): AssetDirs => {
  const stored = project.manifest.folders[0];
  const folder = project.folders.find((each) => each.folderId === stored?.folderId);
  return stored && folder ? roleDirs(stored, folder.path) : {};
};

export { projectDirs };
