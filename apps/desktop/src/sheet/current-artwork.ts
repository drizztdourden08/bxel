/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';

const currentArtwork = (): Artwork | null => {
  const { host, activeId } = useDocumentStore.getState();
  return activeId === null ? null : (host.view(activeId)?.state.artwork ?? null);
};

export { currentArtwork };
