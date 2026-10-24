/* @layer renderer-app @kind logic */
import type { ArtworkId, BankId } from '@bxel/document';
import { browserIdSource } from '../documents/browser-id-source';
import type { OpenProject } from '../project/project.type';
import { decodeAssetFiles } from './decode-asset-files';
import { firstTabKey } from './first-tab-key';
import { mergeWorkspace } from './merge-workspace';
import { projectDirs } from './project-dirs';
import { toSlashes } from './to-slashes';
import { NO_BANK_ID } from './workspace.constants';
import type { AssetFile, SeededWorkspace, WorkspaceSeed } from './workspace.type';

const projectSeed = (project: OpenProject, files: readonly AssetFile[]): SeededWorkspace => {
  const ids = browserIdSource();
  const meta = { id: ids.next('art') as ArtworkId, name: project.manifest.name, defaultBankId: NO_BANK_ID as BankId, coverSpriteId: null, presets: [] };
  const merged = mergeWorkspace(decodeAssetFiles(files), ids, meta);
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
