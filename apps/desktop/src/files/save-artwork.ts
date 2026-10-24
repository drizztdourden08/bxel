/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { fileName } from './file-name';
import { failed } from './failed';
import { CANCELLED, FILE_TEXT } from './files.constants';
import type { FileKit, FileOutcome } from './files.type';
import { knownPath } from './known-path';
import { markIfUnchanged } from './mark-if-unchanged';
import { artworkBytes } from './artwork-bytes';
import { saveDestination } from './save-destination';

const saveArtwork = async (kit: FileKit, documentId: DocumentId, asNew: boolean): Promise<FileOutcome> => {
  const view = kit.host.view(documentId);
  if (!view) return failed(FILE_TEXT.noDocument);
  const known = knownPath(kit, documentId, view, asNew);
  if (view.clean && known !== undefined) return { kind: 'done', path: known, notice: null };
  const path = await saveDestination(kit, documentId, view, known);
  if (path === null) return CANCELLED;
  try {
    await kit.documents.write(path, artworkBytes(view.state, kit.clock));
  } catch {
    return failed(FILE_TEXT.saveFailed(fileName(path)));
  }
  kit.paths.remember(documentId, path);
  markIfUnchanged(kit.host, documentId, view.state.revision);
  return { kind: 'done', path, notice: null };
};

export { saveArtwork };
