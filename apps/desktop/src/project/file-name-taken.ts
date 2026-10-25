/* @layer renderer-app @kind logic */
import { isSamePath } from '@bxel/project';
import type { DocumentsPort } from '@drizztdourden08/brock-core';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const fileNameTaken = async (documents: DocumentsPort, folder: string, path: string): Promise<boolean> => {
  const listing = await documents.list(folder);
  if (listing.entries.some((entry) => isSamePath(entry.path, path))) return true;
  return Object.values(useWorkspaceStore.getState().workspaces).some((workspace) => [...workspace.paths.values()].some((known) => isSamePath(known, path)));
};

export { fileNameTaken };
