/* @layer renderer-app @kind logic */
import { ERROR_CODE, flattenFrame } from '@bxel/document';
import { encodeBase64, mcpFailure } from '@bxel/mcp';
import { stepInRamp } from '@bxel/palette';
import { antiAlias as soften } from '@bxel/raster';
import { patchOfPixels } from '../../editor/patch-of-pixels';
import type { ToolHandler } from '../assistant.type';
import { documentFrame } from './document-frame';
import { isReply } from './is-reply';
import { reply } from './reply';
import type { AntiAliasInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const antiAlias: ToolHandler = (input, context) => {
  const { documentId, spriteId, frameId, layerId, edge, mid, inside } = input as AntiAliasInput;
  const found = documentFrame(context, documentId, spriteId, frameId);
  if (isReply(found)) return found;
  const { view, sprite, bank, frameId: frame } = found;
  if (!sprite.layers.some((layer) => layer.id === layerId)) return reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.layerMissing, { path: 'layerId' }));
  const middle = mid ?? stepInRamp(bank, edge, 1) ?? stepInRamp(bank, edge, -1);
  if (middle === null || middle === edge) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noMidColour, { path: 'mid' }));
  const pixels = soften({ pixels: flattenFrame(sprite, frame), width: sprite.width, height: sprite.height, edge, mid: middle, inside });
  const patch = patchOfPixels(pixels, sprite.width, sprite.height);
  const targets = { sprites: [sprite.id], layers: { by: 'ids', ids: [layerId] }, frames: { by: 'ids', ids: [frame] } };
  const step = patch === null ? null : { name: 'pixels.patch', targets, options: { rect: patch.rect, pixels: encodeBase64(patch.pixels), skipZero: true } };
  return reply({ ok: true, revision: view.state.revision, spriteId: sprite.id, frameId: frame, edge, mid: middle, changed: pixels.length, step });
};

export { antiAlias };
