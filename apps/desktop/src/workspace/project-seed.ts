/* @layer renderer-app @kind logic */
import { browserIdSource } from '../documents/browser-id-source';
import type { OpenProject } from '../project/project.type';
import { decodeAssetFiles } from './decode-asset-files';
import { firstTabKey } from './first-tab-key';
import { looseMeta } from './loose-meta';
import { mergeWorkspace } from './merge-workspace';
import { projectDirs } from './project-dirs';
import { toSlashes } from './to-slashes';
import type { AssetFile, SeededWorkspace, WorkspaceSeed } from './workspace.type';

const projectSeed = (project: OpenProject, files: readonly AssetFile[]): SeededWorkspace => {
  const ids = browserIdSource();
  const merged = mergeWorkspace(decodeAssetFiles(files), ids, looseMeta(ids, project.manifest.name));
  const seed: WorkspaceSeed = {
    kind: 'project',
    name: project.manifest.name,
    root: toSlashes(project.rootRealPath),
    dirs: projectDirs(project),
    projectFile: toSlashes(project.projectFile),
    paths: merged.paths,
    dirty: merged.dirty,
    legacy: null,
    artwork: merged.artwork,
    readOnly: false,
    unsaved: false,
    focus: firstTabKey(merged.artwork),
  };
  return { seed, merged };
};

export { projectSeed };
