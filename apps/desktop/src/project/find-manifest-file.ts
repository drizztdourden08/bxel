/* @layer renderer-app @kind logic */
import { isManifestFile, MANIFEST_EXTENSION } from '@bxel/project';
import type { DocumentEntry, DocumentsPort } from '@drizztdourden08/brock-core';

const findManifestFile = async (documents: DocumentsPort, folder: string): Promise<DocumentEntry | null> => {
  const listing = await documents.list(folder, { extensions: [MANIFEST_EXTENSION] });
  return listing.entries.find((entry) => entry.kind === 'file' && isManifestFile(entry.name)) ?? null;
};

export { findManifestFile };
