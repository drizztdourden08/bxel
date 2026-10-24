/* @layer renderer-app @kind logic */
import { assetsTouched, ERROR_CODE } from '@bxel/document';
import type { Artwork, TransactionRequest } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { Failure } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { hiddenAssets } from './hidden-assets';
import { mentions } from './mentions';
import { TOOL_TEXT } from './tools.constants';

const refusal = (): Failure => mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.notFound);

const hiddenEdit = (context: ToolContext, request: TransactionRequest, artwork: Artwork): Failure | null => {
  const hidden = hiddenAssets(context, request.documentId);
  if (hidden.size === 0) return null;
  if (request.steps.some((step) => mentions([step.targets, step.options], hidden))) return refusal();
  const trial = context.host.execute({ ...request, mode: 'preview', previewPixels: 0 });
  if (!trial.ok) return null;
  return assetsTouched(trial.changes, artwork, artwork).some((key) => hidden.has(key.id)) ? refusal() : null;
};

export { hiddenEdit };
