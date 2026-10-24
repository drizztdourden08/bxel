/* @layer renderer-app @kind constants */
import { toast } from '@drizztdourden08/brock-react';
import { createConfigSource } from '../config-source/create-config-source';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useProjectStore } from '../stores/useProjectStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { focusedProject } from './focused-project';
import { PROJECT_CONFIG_TEXT, PROJECT_EDIT_DELAY_MS } from './project-config.constants';
import { PROJECT_FIELDS } from './project-fields.constants';

const watchProjectStores = (listener: () => void): (() => void) => {
  const stops = [useProjectStore.subscribe(listener), useWorkspaceStore.subscribe(listener), useDocumentStore.subscribe(listener)];
  return () => {
    for (const stop of stops) stop();
  };
};

const PROJECT_SOURCE = createConfigSource({
  fields: PROJECT_FIELDS,
  context: focusedProject,
  locked: () => false,
  watch: watchProjectStores,
  delayMs: PROJECT_EDIT_DELAY_MS,
  report: (message) => toast(PROJECT_CONFIG_TEXT.failed(message), { variant: 'danger' }),
});

export { PROJECT_SOURCE };
