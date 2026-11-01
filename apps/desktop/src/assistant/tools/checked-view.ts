/* @layer renderer-app @kind logic */
import { hiddenFailure } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { checkRevision } from './check-revision';
import { reply } from './reply';
import { viewFor } from './view-for';

const checkedView = (context: ToolContext, documentId: string, expectedRevision: number | undefined): DocumentView | ToolReply => {
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const stale = checkRevision(view, expectedRevision);
  return stale ? reply(stale) : view;
};

export { checkedView };
