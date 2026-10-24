/* @layer renderer-app @kind hook */
import { useMemo } from 'react';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { activeAssetOf } from '../workspace/active-asset-of';
import type { ActiveAsset } from '../workspace/workspace.type';
import { useActiveDocument } from './useActiveDocument';

const useActiveAsset = (): ActiveAsset | null => {
  const view = useActiveDocument();
  const documentId = view?.state.documentId;
  const workspace = useWorkspaceStore((state) => (documentId === undefined ? undefined : state.workspaces[documentId]));
  const tab = useWorkspaceStore((state) => state.tabs.find((each) => each.id === state.activeTab && each.documentId === documentId));
  return useMemo(() => (view ? activeAssetOf(view, workspace, tab) : null), [view, workspace, tab]);
};

export { useActiveAsset };
