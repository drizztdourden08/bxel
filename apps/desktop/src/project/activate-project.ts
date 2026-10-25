/* @layer renderer-app @kind logic */
import { resolveFolders } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { toast, useWidgetLayoutStore } from '@drizztdourden08/brock-react';
import { fileKit } from '../files/file-kit';
import { useProjectStore } from '../stores/useProjectStore';
import { loadProjectWorkspace } from '../workspace/load-project-workspace';
import { askTurnOn } from './ask-turn-on';
import { grantedFolders } from './granted-folders';
import { handOverProject } from './hand-over-project';
import { leaveProject } from './leave-project';
import { PROJECT_TEXT, PROJECT_WIDGET_ID } from './project.constants';
import type { LoadedManifest, ProjectOutcome } from './project.type';
import { rememberProject } from './remember-project';

const activateProject = async (documents: DocumentsPort, root: string, loaded: LoadedManifest): Promise<ProjectOutcome | null> => {
  const { manifest, projectFile, preview, migrated } = loaded;
  const resolved = resolveFolders(manifest.folders, root);
  if (!resolved.ok) return { ok: false, message: resolved.message };
  if (!(await leaveProject({ manifest, rootRealPath: root }))) return null;
  const folders = await grantedFolders(documents, root, resolved.value);
  const next = { manifest, rootRealPath: root, projectFile, preview, folders };
  handOverProject(documents, next);
  useProjectStore.getState().open(next);
  rememberProject(manifest, root);
  useWidgetLayoutStore.getState().open(PROJECT_WIDGET_ID);
  if (migrated) toast(PROJECT_TEXT.migrated, { variant: 'info' });
  const kit = fileKit();
  if (kit) await loadProjectWorkspace({ ...kit, documents }, next);
  void askTurnOn(manifest, root);
  return { ok: true };
};

export { activateProject };
