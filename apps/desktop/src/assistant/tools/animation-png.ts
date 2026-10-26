/* @layer renderer-app @kind logic */
import { encodePngRgba, upscaleRgba } from '@bxel/formats';
import { MCP_ERROR_CODE, mcpFailure, RENDER_SIDE_MAX } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { AnimationStrip, FramePng } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const animationPng = ({ image }: AnimationStrip, scale: number): McpResult<FramePng> => {
  if (image.width * scale > RENDER_SIDE_MAX || image.height * scale > RENDER_SIDE_MAX) {
    return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.tooLarge(RENDER_SIDE_MAX), { path: 'scale' });
  }
  const scaled = upscaleRgba(image, scale);
  const encoded = encodePngRgba(scaled);
  if (!encoded.ok) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, encoded.message);
  return { ok: true, value: { bytes: encoded.bytes, width: scaled.width, height: scaled.height } };
};

export { animationPng };
