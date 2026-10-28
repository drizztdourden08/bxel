/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { currentTab } from '../workspace/current-tab';
import { resolveSubject } from './resolve-subject';
import type { SubjectState } from './properties-subject.type';
import { useSubjectStore } from './useSubjectStore';

const readSubject = (): SubjectState => {
  const { views } = useDocumentStore.getState();
  const { tabs, workspaces } = useWorkspaceStore.getState();
  return resolveSubject({ pin: useSubjectStore.getState().pin, follow: currentTab(), tabs, workspaces, views });
};

export { readSubject };
