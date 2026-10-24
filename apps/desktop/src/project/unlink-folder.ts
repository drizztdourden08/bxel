/* @layer renderer-app @kind logic */
import type { ProjectDocument } from '@bxel/project';

const unlinkFolder = (manifest: ProjectDocument, folderId: string): ProjectDocument => {
  const rootId = manifest.folders[0]?.folderId;
  if (rootId === undefined || rootId === folderId) return manifest;
  const { folders, ...assistant } = manifest.assistant;
  const kept = folders?.filter((each) => each !== folderId);
  return {
    ...manifest,
    folders: manifest.folders.filter((folder) => folder.folderId !== folderId),
    assistant: kept === undefined ? assistant : { ...assistant, folders: kept },
  };
};

export { unlinkFolder };
