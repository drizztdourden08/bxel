/* @layer renderer-app @kind logic */
import { useNavigationStore } from '@drizztdourden08/brock-react';
import { useSubjectStore } from '../properties-subject/useSubjectStore';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useViewStore } from '../stores/useViewStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const watchAssetStores = (listener: () => void): (() => void) => {
  const stops = [useDocumentStore.subscribe(listener), useWorkspaceStore.subscribe(listener), useViewStore.subscribe(listener), useSubjectStore.subscribe(listener), useNavigationStore.subscribe(listener)];
  return () => {
    for (const stop of stops) stop();
  };
};

export { watchAssetStores };
