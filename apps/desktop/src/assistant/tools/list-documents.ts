/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { canSee, DOCUMENTS_LISTED_MAX } from '@bxel/mcp';
import { fileName } from '../../files/file-name';
import { useAssistantStore } from '../../stores/useAssistantStore';
import { useDocumentStore } from '../../stores/useDocumentStore';
import type { ToolContext, ToolHandler } from '../assistant.type';
import { placeOf } from './place-of';
import { reply } from './reply';

const entryOf = (context: ToolContext, documentId: DocumentId) => {
  const view = context.host.view(documentId);
  if (!view) return [];
  const path = context.paths.pathOf(documentId);
  return [
    {
      documentId,
      name: view.state.artwork.name,
      fileName: path === undefined ? null : fileName(path),
      place: placeOf(context, path),
      revision: view.state.revision,
      dirty: !view.clean,
      readOnly: view.state.readOnly,
      active: useDocumentStore.getState().activeId === documentId,
      openedBy: useAssistantStore.getState().opened[documentId] ? 'mcp' : 'owner',
      sprites: view.state.artwork.sprites.length,
      sheets: view.state.artwork.sheets.length,
    },
  ];
};

const listDocuments: ToolHandler = (_input, context) => {
  const ids = canSee(context.settings.assistantSee, 'open_document') ? context.host.list() : [];
  const documents = ids.flatMap((documentId) => entryOf(context, documentId)).slice(0, DOCUMENTS_LISTED_MAX);
  return reply({ ok: true, documents });
};

export { listDocuments };
