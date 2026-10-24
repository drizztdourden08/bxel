/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { canSee } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';

const viewFor = (context: ToolContext, documentId: string): DocumentView | null =>
  canSee(context.settings.assistantSee, 'open_document') ? context.host.view(documentId as DocumentId) : null;

export { viewFor };
