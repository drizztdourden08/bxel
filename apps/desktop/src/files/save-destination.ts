/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import type { DocumentView } from '../documents/document-host.type';
import { BXEL_FILTERS, BXEL_SUFFIX, FILE_TEXT } from './files.constants';
import type { FileKit } from './files.type';

const saveDestination = async (
  kit: FileKit,
  documentId: DocumentId,
  view: DocumentView,
  known: string | undefined,
): Promise<string | null> =>
  known ??
  kit.documents.saveAs({
    title: FILE_TEXT.saveTitle,
    defaultPath: kit.paths.pathOf(documentId) ?? `${view.state.project.name}${BXEL_SUFFIX}`,
    filters: BXEL_FILTERS,
  });

export { saveDestination };
