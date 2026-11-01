/* @layer renderer-app @kind logic */
import { emptyCel, ERROR_CODE, flattenFrame, readRect } from '@bxel/document';
import type { FrameId, Sprite } from '@bxel/document';
import { encodeBase64, mcpFailure } from '@bxel/mcp';
import type { ToolHandler } from '../assistant.type';
import { colorUse } from './color-use';
import { documentFrame } from './document-frame';
import { indexHash } from './index-hash';
import { isReply } from './is-reply';
import { reply } from './reply';
import type { ReadPixelsInput, WireRect } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const layerSource = (sprite: Sprite, frameId: FrameId, layerId: string): Uint8Array | null => {
  const layer = sprite.layers.find((candidate) => candidate.id === layerId);
  if (!layer) return null;
  const celId = layer.cels[frameId];
  return (celId === undefined ? undefined : sprite.cels[celId]?.pixels) ?? emptyCel(sprite);
};

const inside = (sprite: Sprite, rect: WireRect): boolean =>
  rect.x + rect.width <= sprite.width && rect.y + rect.height <= sprite.height;

const readPixels: ToolHandler = async (input, context) => {
  const { documentId, spriteId, frameId, layer, rect } = input as ReadPixelsInput;
  const found = documentFrame(context, documentId, spriteId, frameId);
  if (isReply(found)) return found;
  const { view, sprite } = found;
  if (!inside(sprite, rect)) return reply(mcpFailure(ERROR_CODE.OUT_OF_BOUNDS, TOOL_TEXT.outside, { path: 'rect' }));
  const source = layer === 'flattened' ? flattenFrame(sprite, found.frameId) : layerSource(sprite, found.frameId, layer.layerId);
  if (!source) return reply(mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.notFound, { path: 'layer' }));
  const pixels = readRect(source, sprite.width, rect);
  return reply({
    ok: true,
    revision: view.state.revision,
    rect,
    encoding: 'u8-rowmajor-base64',
    pixels: encodeBase64(pixels),
    indexHash: await indexHash(pixels),
    colorUse: colorUse(pixels),
  });
};

export { readPixels };
