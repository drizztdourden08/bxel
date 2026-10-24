/* @layer core @kind logic */
import { ASSETS_DIR } from '../container/project-container.constants';
import type { FolderId } from '../ids/id.type';
import { ROOT_FOLDER_PATH } from '../manifest/manifest.constants';
import type { ProjectDocument } from '../project-document/project-document.type';

const packedManifest = (manifest: ProjectDocument, dirs: ReadonlyMap<FolderId, string>): ProjectDocument => ({
  ...manifest,
  folders: manifest.folders.map((folder, index) => ({
    ...folder,
    path: index === 0 ? ROOT_FOLDER_PATH : `${ASSETS_DIR}${dirs.get(folder.folderId) ?? ''}`,
  })),
  assistant: { ...manifest.assistant, access: 'off' },
});

export { packedManifest };
