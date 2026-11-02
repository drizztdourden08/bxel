/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { hiddenFailure, mcpFailure } from '@bxel/mcp';
import type { ToolHandler } from '../assistant.type';
import { overlayRequest } from './overlay-request';
import { reply } from './reply';
import { applyViewOptions } from './render-view-options';
import { renderByTarget } from './render-by-target';
import { renderFilePreview } from './render-file-preview';
import { renderSpritePreview } from './render-sprite-preview';
import type { RenderInput, RenderRequest } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';

const renderPreview: ToolHandler = async (input, context) => {
  const given = input as RenderRequest;
  const { documentId, target, file } = given;
  if (file !== undefined) return renderFilePreview(context, { file });
  if (documentId === undefined || target === undefined) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noRenderTarget, { path: 'documentId' }));
  const request: RenderInput = overlayRequest({ ...given, documentId, target });
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  const made = await (renderByTarget(context, view, request) ?? renderSpritePreview(context, view, request));
  return applyViewOptions(made, request, view);
};

export { renderPreview };
