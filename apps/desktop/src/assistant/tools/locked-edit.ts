/* @layer renderer-app @kind logic */
import type { Artwork, TransactionRequest } from '@bxel/document';
import type { Failure } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { coveredAssets } from './covered-assets';
import { editTouches } from './edit-touches';
import { lockedCover } from './locked-cover';
import { lockedFailure } from './locked-failure';
import { wholeCovered } from './whole-covered';

const lockedEdit = (context: ToolContext, request: TransactionRequest, artwork: Artwork): Failure | null => {
  const cover = lockedCover(context);
  if (wholeCovered(context, request.documentId, cover)) return lockedFailure();
  return editTouches(context, request, artwork, coveredAssets(context, request.documentId, cover)) ? lockedFailure() : null;
};

export { lockedEdit };
