/* @layer renderer-app @kind logic */
import { DEFAULT_ACTOR, emptyChanges } from '@bxel/document';
import type { DocumentEvent, DocumentState } from '@bxel/document';

const openEvent = (state: DocumentState): DocumentEvent => ({
  kind: 'open',
  documentId: state.documentId,
  revision: state.revision,
  previousRevision: state.revision,
  label: 'Open',
  origin: 'ui',
  actor: DEFAULT_ACTOR,
  changes: emptyChanges(),
});

export { openEvent };
