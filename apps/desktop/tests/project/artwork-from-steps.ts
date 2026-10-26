/* @layer renderer-app @kind test */
import type { Artwork, CommandStep } from '@bxel/document';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';

const artworkFromSteps = (label: string, steps: CommandStep[]): Artwork => {
  const { host } = useDocumentStore.getState();
  const documentId = createDefaultArtwork(host);
  const made = runSteps(host, documentId, label, steps);
  if (!made.ok) throw new Error(made.error.message);
  const artwork = host.view(documentId)?.state.artwork;
  host.close(documentId);
  if (!artwork) throw new Error('no artwork');
  return artwork;
};

export { artworkFromSteps };
