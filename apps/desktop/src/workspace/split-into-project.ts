/* @layer renderer-app @kind logic */
import { splitIntoAssets } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import type { FileKit } from '../files/files.type';
import { manifestForSplit } from '../project-meta/manifest-for-split';
import { saveManifest } from '../project/save-manifest';
import type { OpenProject } from '../project/project.type';
import { useProjectStore } from '../stores/useProjectStore';
import { closeWorkspace } from './close-workspace';
import { loadProjectWorkspace } from './load-project-workspace';
import { projectDirs } from './project-dirs';
import { projectWorkspaceId } from './project-workspace-id';
import { splitPaths } from './split-paths';
import { writeSplit } from './write-split';

const splitIntoProject = async (kit: FileKit, artwork: Artwork, project: OpenProject): Promise<boolean> => {
  const open = projectWorkspaceId();
  if (open !== null && !(await closeWorkspace(open))) return false;
  const plan = splitIntoAssets(artwork);
  const paths = await splitPaths(kit.documents, plan, projectDirs(project));
  await writeSplit(kit, artwork, plan, paths);
  await saveManifest(manifestForSplit(project.manifest, { artwork, paths, folders: project.folders }));
  await loadProjectWorkspace(kit, useProjectStore.getState().project ?? project);
  return true;
};

export { splitIntoProject };
