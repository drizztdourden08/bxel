/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { DEFAULT_ARTWORK } from './default-artwork.constants';
import type { DocumentHost } from './document-host.type';

const createDefaultArtwork = (host: DocumentHost): DocumentId => {
  const created = host.create(DEFAULT_ARTWORK);
  if (!created.ok) throw new Error(created.error.message);
  return created.documentId;
};

export { createDefaultArtwork };
