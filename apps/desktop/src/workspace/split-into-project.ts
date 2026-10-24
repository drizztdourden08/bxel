/* @layer renderer-app @kind logic */
import { splitIntoAssets } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import type { FileKit } from '../files/files.type';
import type { OpenProject } from '../project/project.type';
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
  await writeSplit(kit, artwork, plan, await splitPaths(kit.documents, plan, projectDirs(project)));
  await loadProjectWorkspace(kit, project);
  return true;
};

export { splitIntoProject };
