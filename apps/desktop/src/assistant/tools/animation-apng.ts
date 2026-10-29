/* @layer renderer-app @kind logic */
import type { AnimStep, Animation, Artwork } from '@bxel/document';
import { encodeApng, upscaleRgba } from '@bxel/formats';
import { MCP_ERROR_CODE, mcpFailure, RENDER_SIDE_MAX } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { composedRgba } from '../../timeline/composed-rgba';
import type { FramePng } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const animationApng = (artwork: Artwork, animation: Animation, steps: readonly AnimStep[], options: { readonly scale: number; readonly repeat: number }): McpResult<FramePng> => {
  const { scale } = options;
  const width = animation.width * scale;
  const height = animation.height * scale;
  if (width > RENDER_SIDE_MAX || height > RENDER_SIDE_MAX) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.tooLarge(RENDER_SIDE_MAX), { path: 'scale' });
  const frames = [];
  for (const step of steps) {
    const data = composedRgba(artwork, animation, step.frameId, step.flip);
    if (!data) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.noAnimation);
    frames.push({ pixels: upscaleRgba({ data, width: animation.width, height: animation.height }, scale).data, delayMs: step.durationMs });
  }
  const encoded = encodeApng({ width, height, palette: undefined, loops: options.repeat, frames });
  if (!encoded.ok) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, encoded.message);
  return { ok: true, value: { bytes: encoded.bytes, width, height } };
};

export { animationApng };
