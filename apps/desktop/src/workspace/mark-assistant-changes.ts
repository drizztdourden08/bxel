/* @layer renderer-app @kind logic */
import { assetsTouched } from '@bxel/document';
import type { Artwork, DocumentEvent } from '@bxel/document';
import { useAssistantChangedStore } from '../stores/useAssistantChangedStore';

const markAssistantChanges = (event: DocumentEvent, artwork: Artwork): void => {
  if (event.kind !== 'commit' || event.origin !== 'mcp') return;
  const ids = assetsTouched(event.changes, artwork, artwork)
    .filter((key) => key.kind !== 'project')
    .map((key) => key.id);
  if (ids.length > 0) useAssistantChangedStore.getState().mark(ids);
};

export { markAssistantChanges };
