/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { hiddenFailure } from '@bxel/mcp';
import { artworkBytes } from '../../files/artwork-bytes';
import { fileName } from '../../files/file-name';
import { markIfUnchanged } from '../../files/mark-if-unchanged';
import type { ToolHandler } from '../assistant.type';
import { checkRevision } from './check-revision';
import { placeOf } from './place-of';
import { reply } from './reply';
import type { SaveInput } from './tool-input.type';
import { viewFor } from './view-for';
import { writePlace } from './write-place';

const saveDocument: ToolHandler = async (input, context) => {
  const save = input as SaveInput;
  const view = viewFor(context, save.documentId);
  if (!view) return reply(hiddenFailure('document'));
  const stale = checkRevision(view, save.expectedRevision);
  if (stale) return reply(stale);
  const place = writePlace(context, save);
  if (!place.ok) return reply(place);
  const documentId = save.documentId as DocumentId;
  const { revision } = view.state;
  const bytes = artworkBytes(view.state, () => Date.now());
  await context.documents.write(place.value, bytes);
  context.paths.remember(documentId, place.value);
  markIfUnchanged(context.host, documentId, revision);
  return reply({
    ok: true,
    revision,
    fileName: fileName(place.value),
    place: placeOf(place.value, context.call.folder),
    bytes: bytes.length,
    savedAt: new Date().toISOString(),
  });
};

export { saveDocument };
