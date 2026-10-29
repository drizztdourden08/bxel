/* @layer core @kind logic */
import { checkManifestFolders } from '../manifest/check-manifest-folders';
import type { ManifestIssue } from '../manifest/manifest.type';
import { PROJECT_ORGANISE_VERSION } from './project-document.constants';
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

const checkCover = (manifest: ProjectDocument, known: ReadonlySet<string>): ManifestIssue[] =>
  manifest.cover !== undefined && !known.has(manifest.cover.folderId)
    ? [{ path: ['cover', 'folderId'], message: 'The cover names a folder the project does not have.' }]
    : [];

const repeated = (values: readonly string[]): boolean => new Set(values).size !== values.length;

const checkOrganise = (manifest: ProjectDocument): ManifestIssue[] => {
  const { organise } = manifest;
  const issues: ManifestIssue[] = [];
  if ((organise !== undefined) !== (manifest.formatVersion === PROJECT_ORGANISE_VERSION)) {
    issues.push({ path: ['organise'], message: 'The organise block belongs to format version 3, and version 3 holds it.' });
  }
  if (organise === undefined) return issues;
  if (repeated(organise.collections.map((each) => each.id))) issues.push({ path: ['organise', 'collections'], message: 'A collection id is used once.' });
  if (repeated(organise.smart.map((each) => each.id))) issues.push({ path: ['organise', 'smart'], message: 'A smart filter id is used once.' });
  if (repeated(organise.pinned)) issues.push({ path: ['organise', 'pinned'], message: 'A file is pinned once.' });
  if (Object.values(organise.tags).some((names) => repeated(names.map((name) => name.toLowerCase())))) {
    issues.push({ path: ['organise', 'tags'], message: 'A file holds a tag once.' });
  }
  return issues;
};

const checkProjectDocument = (manifest: ProjectDocument): ManifestIssue[] => {
  const known = new Set<string>(manifest.folders.map((folder) => folder.folderId));
  return [
    ...checkOrganise(manifest),
    ...checkManifestFolders(manifest.folders),
    ...checkCover(manifest, known),
    ...checkDefaultPalette(manifest, known),
    ...checkAssistantFolders(manifest, known),
  ];
};

export { checkProjectDocument };
