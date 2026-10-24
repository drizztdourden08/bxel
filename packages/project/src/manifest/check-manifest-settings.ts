/* @layer core @kind logic */
import type { ManifestIssue, ProjectFolder, ProjectSettings } from './manifest.type';

const checkManifestSettings = (
  settings: ProjectSettings,
  folders: readonly ProjectFolder[],
): ManifestIssue[] => {
  const known = new Set<string>(folders.map((folder) => folder.folderId));
  return Object.entries(settings).flatMap(([key, location]) =>
    location === null || known.has(location.folderId)
      ? []
      : [{ path: ['settings', key, 'folderId'], message: 'The setting names a folder the project does not have.' }],
  );
};

export { checkManifestSettings };
