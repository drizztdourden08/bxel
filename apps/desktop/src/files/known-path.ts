/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import type { FileKit } from './files.type';

const knownPath = (kit: FileKit, documentId: DocumentId, view: DocumentView, asNew: boolean): string | undefined =>
  asNew || view.state.readOnly ? undefined : kit.paths.pathOf(documentId);

export { knownPath };
