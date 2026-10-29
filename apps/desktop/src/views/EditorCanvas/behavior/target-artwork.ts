/* @layer renderer-app @kind logic */
import type { Artwork } from '@bxel/document';
import type { EditorTarget } from '../../../editor/editor.type';
import { useDocumentStore } from '../../../stores/useDocumentStore';

const targetArtwork = (target: EditorTarget | null): Artwork | undefined =>
  target ? useDocumentStore.getState().host.view(target.documentId)?.state.artwork : undefined;

export { targetArtwork };
