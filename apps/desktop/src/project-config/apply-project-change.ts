/* @layer renderer-app @kind logic */
import { COMMAND_NAME } from '@bxel/document';
import type { ProjectDocument } from '@bxel/project';
import { saveManifest } from '../project/save-manifest';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { runSteps } from '../transactions/run-steps';
import { keyOf } from '../workspace/key-of';
import { PROJECT_LABEL } from './project-config.constants';
import type { ProjectFocus, ProjectOutcomeText } from './project-config.type';

const withoutProjectKey = (dirty: ReadonlySet<string>): Set<string> => new Set([...dirty].filter((id) => keyOf(id)?.kind !== 'project'));

const applyProjectChange = async (focus: ProjectFocus, manifest: ProjectDocument, meta: object): Promise<ProjectOutcomeText> => {
  const { documentId } = focus;
  if (documentId !== null && Object.keys(meta).length > 0) {
    const done = runSteps(useDocumentStore.getState().host, documentId, PROJECT_LABEL, [{ name: COMMAND_NAME.artworkUpdate, targets: null, options: meta }]);
    if (!done.ok) return done.error.message;
  }
  const saved = await saveManifest(manifest);
  if (documentId !== null) useWorkspaceStore.getState().patch(documentId, (workspace) => ({ ...workspace, dirty: withoutProjectKey(workspace.dirty) }));
  return saved.ok ? null : saved.message;
};

export { applyProjectChange };
