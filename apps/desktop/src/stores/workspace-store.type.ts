/* @layer renderer-app @kind types */
import type { DocumentId } from '@bxel/document';
import type { OpenTab, Workspace } from '../workspace/workspace.type';

type WorkspaceLoading = { readonly done: number; readonly total: number };

interface WorkspaceSlice {
  workspaces: Readonly<Record<string, Workspace>>;
  tabs: readonly OpenTab[];
  activeTab: string | null;
  loading: WorkspaceLoading | null;
  splitting: DocumentId | null;
}

interface WorkspaceState extends WorkspaceSlice {
  put: (workspace: Workspace, tabs: readonly OpenTab[]) => void;
  patch: (documentId: DocumentId, change: (workspace: Workspace) => Workspace) => void;
  drop: (documentId: DocumentId) => void;
  addTab: (tab: OpenTab) => void;
  closeTab: (tabId: string) => void;
  moveTab: (from: number, to: number) => void;
  setActiveTab: (tabId: string | null) => void;
  setLoading: (loading: WorkspaceLoading | null) => void;
  showSplit: (documentId: DocumentId | null) => void;
}

export type { WorkspaceLoading, WorkspaceSlice, WorkspaceState };
