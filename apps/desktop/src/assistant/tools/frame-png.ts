/* @layer renderer-app @kind logic */
import { encodePngRgba, upscaleRgba } from '@bxel/formats';
import { MCP_ERROR_CODE, mcpFailure, RENDER_SIDE_MAX } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { frameImage } from '../../files/frame-image';
import type { FramePng, SpriteFrame } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const framePng = ({ sprite, bank, frameId }: SpriteFrame, scale: number): McpResult<FramePng> => {
  if (sprite.width * scale > RENDER_SIDE_MAX || sprite.height * scale > RENDER_SIDE_MAX) {
    return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.tooLarge(RENDER_SIDE_MAX), { path: 'scale' });
  }
  const image = upscaleRgba(frameImage(sprite, bank, frameId), scale);
  const encoded = encodePngRgba(image);
  if (!encoded.ok) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, encoded.message);
  return { ok: true, value: { bytes: encoded.bytes, width: image.width, height: image.height } };
};

export { framePng };
