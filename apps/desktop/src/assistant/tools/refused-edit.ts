/* @layer renderer-app @kind logic */
import type { Artwork, TransactionRequest } from '@bxel/document';
import type { Failure } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { hiddenEdit } from './hidden-edit';
import { lockedEdit } from './locked-edit';

const refusedEdit = (context: ToolContext, request: TransactionRequest, artwork: Artwork): Failure | null =>
  hiddenEdit(context, request, artwork) ?? lockedEdit(context, request, artwork);

export { refusedEdit };
