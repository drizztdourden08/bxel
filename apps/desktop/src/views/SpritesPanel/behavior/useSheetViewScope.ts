/* @layer renderer-app @kind hook */
import { useActiveDocument } from '../../../hooks/useActiveDocument';
import { useWorkspaceStore } from '../../../stores/useWorkspaceStore';

const useSheetViewScope = (): string | null => {
  const documentId = useActiveDocument()?.state.documentId;
  const workspace = useWorkspaceStore((state) => (documentId === undefined ? undefined : state.workspaces[documentId]));
  const home = workspace?.root ?? workspace?.projectFile ?? null;
  return home === null ? null : `doc:${home}`;
};

export { useSheetViewScope };
