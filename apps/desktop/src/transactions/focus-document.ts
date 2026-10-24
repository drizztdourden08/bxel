/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { useDocumentStore } from '../stores/useDocumentStore';
import { useToolStore } from '../stores/useToolStore';

const focusDocument = (documentId: DocumentId): void => {
  const { host, setActive } = useDocumentStore.getState();
  const slots = host.view(documentId)?.state.artwork.banks[0]?.slots.length ?? 1;
  const tools = useToolStore.getState();
  tools.setColour('foreground', slots > 1 ? 1 : 0);
  tools.setColour('background', 0);
  tools.setColour('third', slots > 2 ? 2 : 0);
  tools.setColour('fourth', slots > 3 ? 3 : 0);
  tools.setLayer(null);
  setActive(documentId);
};

export { focusDocument };
