/* @layer renderer-app @kind logic */
import type { DocumentId } from '@bxel/document';
import { canSee } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { documentHidden } from './document-hidden';
import { hiddenAssets } from './hidden-assets';

const viewFor = (context: ToolContext, documentId: string): DocumentView | null => {
  if (!canSee(context.settings.assistantSee, 'open_document')) return null;
  const view = context.host.view(documentId as DocumentId);
  return view && !documentHidden(view.state.artwork, hiddenAssets(context, documentId)) ? view : null;
};

export { viewFor };
