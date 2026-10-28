/* @layer renderer-app @kind logic */
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';
import { findTabByPath } from './find-tab-by-path';
import type { OpenTab } from './workspace.type';

const findAssetTab = (path: string): OpenTab | null => findTabByPath(useWorkspaceStore.getState().workspaces, useDocumentStore.getState().views, path);

export { findAssetTab };
