/* @layer renderer-app @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import type { Animation } from '@bxel/document';
import { fileName } from '../files/file-name';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useWorkspaceStore } from '../stores/useWorkspaceStore';

const animationFileName = (animation: Animation): string => {
  const { activeId } = useDocumentStore.getState();
  const workspace = Object.values(useWorkspaceStore.getState().workspaces).find((each) => each.documentId === activeId);
  const path = workspace?.paths.get(animation.id);
  return path === undefined ? `${animation.name}${ASSET_FORMAT.animation.extension}` : fileName(path);
};

export { animationFileName };
