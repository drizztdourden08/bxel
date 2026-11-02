/* @layer renderer-app @kind logic */
import { fileKit } from '../files/file-kit';
import { useHealthStore } from '../stores/useHealthStore';
import { useProjectStore } from '../stores/useProjectStore';
import { scanLinkIndex } from '../workspace/scan-link-index';
import { buildHealth } from './build-health';
import type { HealthState } from './project-health.type';
import { unsavedFiles } from './unsaved-files';

const scanHealth = async (): Promise<Extract<HealthState, { status: 'ready' }> | null> => {
  const kit = fileKit();
  const { project } = useProjectStore.getState();
  if (!kit || !project) return null;
  const index = await scanLinkIndex(kit.documents, project);
  return { status: 'ready', index, report: buildHealth(index, { project, unsaved: unsavedFiles(), repaired: useHealthStore.getState().repaired, rekeyed: useHealthStore.getState().rekeyed }) };
};

export { scanHealth };
