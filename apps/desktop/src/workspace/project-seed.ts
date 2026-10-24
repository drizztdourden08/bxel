/* @layer renderer-app @kind logic */
import { browserIdSource } from '../documents/browser-id-source';
import { metaFromManifest } from '../project-meta/meta-from-manifest';
import type { OpenProject } from '../project/project.type';
import { decodeAssetFiles } from './decode-asset-files';
import { firstTabKey } from './first-tab-key';
import { mergeWorkspace } from './merge-workspace';
import { projectDirs } from './project-dirs';
import { toSlashes } from './to-slashes';
import type { AssetFile, SeededWorkspace, WorkspaceSeed } from './workspace.type';

const projectSeed = (project: OpenProject, files: readonly AssetFile[]): SeededWorkspace => {
  const ids = browserIdSource();
  const decoded = decodeAssetFiles(files);
  const merged = mergeWorkspace(decoded, ids, metaFromManifest(project.manifest, project.folders, ids, decoded.sources));
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
