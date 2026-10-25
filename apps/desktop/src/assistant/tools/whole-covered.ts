/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { isSamePath } from '@bxel/project';
import { useWorkspaceStore } from '../../stores/useWorkspaceStore';
import type { FolderCover, ToolContext } from '../assistant.type';
import { insideCover } from './inside-cover';

const wholeCovered = (context: ToolContext, documentId: string, cover: FolderCover): boolean => {
  if (cover.folders.length === 0 && cover.projectFiles.length === 0) return false;
  const workspace = useWorkspaceStore.getState().workspaces[documentId];
  const owned = workspace?.kind === 'project' ? workspace.projectFile : null;
  return (
    insideCover(cover, context.paths.pathOf(documentId as DocumentId)) ||
    insideCover(cover, workspace?.legacy?.path) ||
    (owned !== null && cover.projectFiles.some((file) => isSamePath(file, owned)))
  );
};

export { wholeCovered };
