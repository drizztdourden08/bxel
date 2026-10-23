/* @layer renderer-app @kind logic */
import { emptyChanges } from '@bxel/document';
import type { DocumentEvent, DocumentState } from '@bxel/document';

const openEvent = (state: DocumentState): DocumentEvent => ({
  kind: 'open',
  documentId: state.documentId,
  revision: state.revision,
  previousRevision: state.revision,
  label: 'Open',
  origin: 'ui',
  changes: emptyChanges(),
});

export { openEvent };
