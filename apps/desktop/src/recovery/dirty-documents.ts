/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import { documentName } from '../files/document-name';
import type { DirtyDocument } from './recovery.type';

const dirtyDocuments = (
  views: Readonly<Record<string, DocumentView>>,
  order: readonly DocumentId[],
  pathOf: (documentId: DocumentId) => string | undefined,
): DirtyDocument[] =>
  order.flatMap((documentId) => {
    const view = views[documentId];
    return view === undefined || view.clean
      ? []
      : [{ documentId, name: documentName(view.state.project.name, pathOf(documentId)) }];
  });

export { dirtyDocuments };
