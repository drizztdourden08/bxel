/* @layer renderer-app @kind logic */
import type { ProjectManifest } from '@bxel/project';
import { toast } from '@drizztdourden08/brock-react';
import type { ProjectSetsState } from '../stores/project-sets-store.type';
import { useProjectSetsStore } from '../stores/useProjectSetsStore';
import { useProjectStore } from '../stores/useProjectStore';
import { saveManifest } from './save-manifest';

const manifestToSave = (state: ProjectSetsState, before: ProjectSetsState): ProjectManifest | null => {
  const manifest = useProjectStore.getState().project?.manifest;
  if (state.sets === before.sets || !manifest) return null;
  return state.projectName === manifest.name && state.sets !== manifest.swatchSets ? { ...manifest, swatchSets: state.sets } : null;
};

const syncProjectSets = (): (() => void) =>
  useProjectSetsStore.subscribe((state, before) => {
    const next = manifestToSave(state, before);
    if (next === null) return;
    void saveManifest(next).then((outcome) => {
      if (!outcome.ok) toast(outcome.message, { variant: 'danger' });
    });
  });

export { syncProjectSets };
