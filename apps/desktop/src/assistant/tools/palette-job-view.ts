/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import type { ToolReply } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { bankOf } from './bank-of';
import { checkedView } from './checked-view';
import { isReply } from './is-reply';
import type { PaletteBankInput } from './palette-file-input.type';
import { reply } from './reply';

const paletteJobView = (context: ToolContext, job: PaletteBankInput): { readonly view: DocumentView; readonly bank: PaletteBank } | ToolReply => {
  const view = checkedView(context, job.documentId, job.expectedRevision);
  if (isReply(view)) return view;
  const bank = bankOf(context, view, job);
  return bank.ok ? { view, bank: bank.value } : reply(bank);
};

export { paletteJobView };
