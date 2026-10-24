/* @layer renderer-app @kind hook */
import type { HistoryDirection } from '../editor/editor.type';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const useStepName = (direction: HistoryDirection): string | undefined => {
  const activeId = useDocumentStore((state) => state.activeId);
  return useWorkspaceStore((state) => (activeId === null ? undefined : state.workspaces[activeId]?.steps[direction].at(-1)));
};

export { useStepName };
