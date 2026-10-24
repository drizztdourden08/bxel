/* @layer renderer-app @kind logic */
import { resolveFolders } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import { useProjectSetsStore } from '../stores/useProjectSetsStore';
import { useProjectStore } from '../stores/useProjectStore';
import { askTurnOn } from './ask-turn-on';
import { grantedFolders } from './granted-folders';
import { PROJECT_WIDGET_ID } from './project.constants';
import type { LoadedManifest, ProjectOutcome } from './project.type';
import { rememberProject } from './remember-project';

const activateProject = async (documents: DocumentsPort, root: string, loaded: LoadedManifest): Promise<ProjectOutcome> => {
  const { manifest, manifestPath } = loaded;
  const resolved = resolveFolders(manifest.folders, root);
  if (!resolved.ok) return { ok: false, message: resolved.message };
  const folders = await grantedFolders(documents, root, resolved.value);
  useProjectStore.getState().open({ manifest, rootRealPath: root, manifestPath, folders });
  useProjectSetsStore.getState().open(manifest.name, manifest.swatchSets);
  rememberProject(manifest, root);
  useWidgetLayoutStore.getState().open(PROJECT_WIDGET_ID);
  void askTurnOn(manifest, root);
  return { ok: true };
};

export { activateProject };
