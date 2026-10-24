/* @layer renderer-app @kind logic */
import { effectiveGrant } from '@bxel/project';
import type { ProjectDocument } from '@bxel/project';
import { confirmAction } from '@drizztdourden08/brock-react';
import { useProjectStore } from '../stores/useProjectStore';
import { ACCESS_LABEL, PROJECT_TEXT } from './project.constants';
import { setProjectAccess } from './set-project-access';

const askTurnOn = async (manifest: ProjectDocument, rootRealPath: string): Promise<void> => {
  const { port } = useProjectStore.getState();
  if (!port || !effectiveGrant(manifest, rootRealPath, port.read().assistantProjects).turnItOnHere) return;
  const level = ACCESS_LABEL[manifest.assistant.access].toLowerCase();
  const sure = await confirmAction({
    title: PROJECT_TEXT.turnOnTitle,
    message: PROJECT_TEXT.turnOnMessage(manifest.name, level),
    confirmLabel: PROJECT_TEXT.turnOnConfirm,
    cancelLabel: PROJECT_TEXT.turnOnCancel,
  });
  if (sure) await setProjectAccess(port, { projectId: manifest.projectId, rootRealPath }, manifest.assistant.access);
};

export { askTurnOn };
