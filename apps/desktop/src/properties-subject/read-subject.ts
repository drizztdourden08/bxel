/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { currentTab } from '../workspace/current-tab';
import { resolveSubject } from './resolve-subject';
import type { SubjectState } from './properties-subject.type';
import { readPin } from './read-pin';

const readSubject = (): SubjectState => {
  const { views } = useDocumentStore.getState();
  const { tabs, workspaces } = useWorkspaceStore.getState();
  return resolveSubject({ pin: readPin(), follow: currentTab(), tabs, workspaces, views });
};

export { readSubject };
