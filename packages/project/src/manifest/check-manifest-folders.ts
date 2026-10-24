/* @layer core @kind logic */
import { ROOT_FOLDER_PATH } from './manifest.constants';
import type { ManifestIssue, ProjectFolder } from './manifest.type';

const checkManifestFolders = (folders: readonly ProjectFolder[]): ManifestIssue[] => {
  const issues: ManifestIssue[] = [];
  const seen = new Set<string>();
  folders.forEach((folder, index) => {
    const isRoot = folder.path === ROOT_FOLDER_PATH;
    if (index === 0 && !isRoot) {
      issues.push({ path: ['folders', 0, 'path'], message: 'The first folder is the root and its path is ".".' });
    }
    if (index > 0 && isRoot) {
      issues.push({ path: ['folders', index, 'path'], message: 'Only the first folder has the path ".".' });
    }
    if (seen.has(folder.folderId)) {
      issues.push({ path: ['folders', index, 'folderId'], message: 'A folder id is used once.' });
    }
    seen.add(folder.folderId);
  });
  return issues;
};

export { checkManifestFolders };
