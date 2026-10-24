/* @layer core @kind logic */
import { checkManifestFolders } from '../manifest/check-manifest-folders';
import type { ManifestIssue } from '../manifest/manifest.type';
import type { ProjectDocument } from './project-document.type';

const checkAssistantFolders = (manifest: ProjectDocument, known: ReadonlySet<string>): ManifestIssue[] => {
  const seen = new Set<string>();
  const issues: ManifestIssue[] = [];
  (manifest.assistant.folders ?? []).forEach((folderId, index) => {
    const path = ['assistant', 'folders', index];
    if (!known.has(folderId)) issues.push({ path, message: 'The assistant folder list names a folder the project does not have.' });
    if (seen.has(folderId)) issues.push({ path, message: 'A folder is listed once.' });
    seen.add(folderId);
  });
  return issues;
};

const checkDefaultPalette = (manifest: ProjectDocument, known: ReadonlySet<string>): ManifestIssue[] => {
  const palette = manifest.defaults.palette;
  return palette?.kind === 'file' && !known.has(palette.folderId)
    ? [{ path: ['defaults', 'palette', 'folderId'], message: 'The default palette names a folder the project does not have.' }]
    : [];
};

const checkProjectDocument = (manifest: ProjectDocument): ManifestIssue[] => {
  const known = new Set<string>(manifest.folders.map((folder) => folder.folderId));
  return [
    ...checkManifestFolders(manifest.folders),
    ...checkDefaultPalette(manifest, known),
    ...checkAssistantFolders(manifest, known),
  ];
};

export { checkProjectDocument };
