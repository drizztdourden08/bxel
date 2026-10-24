/* @layer renderer-app @kind logic */
import { ERROR_CODE, flattenFrame } from '@bxel/document';
import { encodeBase64, hiddenFailure, MCP_ERROR_CODE, mcpFailure, RENDER_PNG_BYTES_MAX } from '@bxel/mcp';
import type { ToolHandler } from '../assistant.type';
import { framePng } from './frame-png';
import { indexHash } from './index-hash';
import { reply } from './reply';
import { spriteFrame } from './sprite-frame';
import type { RenderInput } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';
import { viewFor } from './view-for';

const renderPreview: ToolHandler = async (input, context) => {
  const { documentId, target, scale } = input as RenderInput;
  const view = viewFor(context, documentId);
  if (!view) return reply(hiddenFailure('document'));
  if (!('spriteId' in target)) return reply(mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.noSheet, { path: 'target' }));
  const found = spriteFrame(view.state.artwork, target.spriteId, target.frameId);
  if (!found.ok) return reply(found);
  const png = framePng(found.value, scale);
  if (!png.ok) return reply(png);
  if (png.value.bytes.length > RENDER_PNG_BYTES_MAX) return reply(mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.pngTooLarge));
  const { sprite, frameId } = found.value;
  const revision = view.state.revision;
  const uri = `bxel://${documentId}/sprite/${sprite.id}/frame/${frameId}/preview.png?scale=${scale}&rev=${revision}`;
  return reply(
    {
      ok: true,
      revision,
      width: png.value.width,
      height: png.value.height,
      scale,
      indexHash: await indexHash(flattenFrame(sprite, frameId)),
      uri,
    },
    [encodeBase64(png.value.bytes)],
  );
};

export { renderPreview };
