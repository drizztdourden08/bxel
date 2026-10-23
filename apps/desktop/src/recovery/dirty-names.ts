/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import { documentName } from '../files/document-name';

const dirtyNames = (
  views: Readonly<Record<string, DocumentView>>,
  order: readonly DocumentId[],
  pathOf: (documentId: DocumentId) => string | undefined,
): string[] =>
  order.flatMap((documentId) => {
    const view = views[documentId];
    return view === undefined || view.clean ? [] : [documentName(view.state.project.name, pathOf(documentId))];
  });

export { dirtyNames };
