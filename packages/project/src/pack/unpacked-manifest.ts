/* @layer core @kind logic */
import { projectOk } from '../errors/project-ok';
import type { ProjectResult } from '../errors/project-result.type';
import { toStoredFolderPath } from '../folders/to-stored-folder-path';
import type { FolderId } from '../ids/id.type';
import type { DocumentFolder, ProjectDocument } from '../project-document/project-document.type';
import { ROOT_FOLDER_PATH } from '../manifest/manifest.constants';

const unpackedManifest = (
  manifest: ProjectDocument,
  targets: ReadonlyMap<FolderId, string>,
  root: string,
): ProjectResult<ProjectDocument> => {
  const folders: DocumentFolder[] = [];
  for (const [index, folder] of manifest.folders.entries()) {
    const stored = index === 0 ? projectOk(ROOT_FOLDER_PATH) : toStoredFolderPath(root, targets.get(folder.folderId) ?? '');
    if (!stored.ok) return stored;
    folders.push({ ...folder, path: stored.value });
  }
  return projectOk({ ...manifest, folders, assistant: { ...manifest.assistant, access: 'off' } });
};

export { unpackedManifest };
