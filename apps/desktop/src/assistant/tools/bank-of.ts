/* @layer renderer-app @kind logic */
import { ERROR_CODE, findBank } from '@bxel/document';
import type { BankId, PaletteBank } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { DocumentView } from '../../documents/document-host.type';
import type { ToolContext } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { TOOL_TEXT } from './tools.constants';

/** The bank a palette tool names, or the default one. A bank the owner hid from the assistant is not found. */
const bankOf = (context: ToolContext, view: DocumentView, request: { readonly documentId: string; readonly bankId?: string }): McpResult<PaletteBank> => {
  const { artwork } = view.state;
  const bank = findBank(artwork, (request.bankId ?? artwork.defaultBankId) as BankId);
  if (!bank || hiddenAssets(context, request.documentId).has(bank.id)) return mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.bankNotFound, { path: 'bankId' });
  return { ok: true, value: bank };
};

export { bankOf };
