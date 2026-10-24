/* @layer renderer-app @kind logic */
import { ASSET_FORMAT } from '@bxel/document';
import { isManifestFile, MANIFEST_EXTENSION } from '@bxel/project';
import type { DocumentEntry, DocumentsPort } from '@drizztdourden08/brock-core';
import { PROJECT_FILE_EXTENSION } from './project.constants';

const isProjectFile = (entry: DocumentEntry): boolean =>
  entry.kind === 'file' && entry.name.toLowerCase().endsWith(ASSET_FORMAT.project.extension);

const findManifestFile = async (documents: DocumentsPort, folder: string): Promise<DocumentEntry | null> => {
  const listing = await documents.list(folder, { extensions: [PROJECT_FILE_EXTENSION, MANIFEST_EXTENSION] });
  const files = listing.entries.filter((entry) => entry.kind === 'file');
  return files.find(isProjectFile) ?? files.find((entry) => isManifestFile(entry.name)) ?? null;
};

export { findManifestFile };
