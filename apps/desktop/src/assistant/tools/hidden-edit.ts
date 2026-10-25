/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import type { Artwork, TransactionRequest } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { editTouches } from './edit-touches';
import { hiddenAssets } from './hidden-assets';
import { TOOL_TEXT } from './tools.constants';

const hiddenEdit = (context: ToolContext, request: TransactionRequest, artwork: Artwork): Failure | null =>
  editTouches(context, request, artwork, hiddenAssets(context, request.documentId)) ? mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.notFound) : null;

export { hiddenEdit };
