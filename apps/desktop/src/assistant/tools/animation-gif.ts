/* @layer renderer-app @kind logic */
import { composeAnimationFrame, findBank } from '@bxel/document';
import type { AnimStep, Animation, Artwork } from '@bxel/document';
import { encodeGif } from '@bxel/formats';
import { MCP_ERROR_CODE, mcpFailure, RENDER_SIDE_MAX } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { bankRgba } from '../../export/bank-rgba';
import { growIndices } from './grow-indices';
import type { FramePng } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const animationGif = (artwork: Artwork, animation: Animation, steps: readonly AnimStep[], options: { readonly scale: number; readonly repeat: number }): McpResult<FramePng> => {
  const bank = findBank(artwork, animation.bankId);
  const { scale } = options;
  if (!bank) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.noAnimation);
  if (animation.width * scale > RENDER_SIDE_MAX || animation.height * scale > RENDER_SIDE_MAX) {
    return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.tooLarge(RENDER_SIDE_MAX), { path: 'scale' });
  }
  const transparent = bank.slots.findIndex((slot) => slot.kind === 'transparent');
  const encoded = encodeGif({
    width: animation.width * scale,
    height: animation.height * scale,
    palette: bankRgba(bank),
    transparentIndex: transparent < 0 ? null : transparent,
    loops: options.repeat,
    frames: steps.map((step) => ({
      indices: growIndices(composeAnimationFrame(artwork, animation, step.frameId, step.flip), animation.width, animation.height, scale),
      delayMs: step.durationMs,
    })),
  });
  if (!encoded.ok) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, encoded.message);
  return { ok: true, value: { bytes: encoded.bytes, width: animation.width * scale, height: animation.height * scale } };
};

export { animationGif };
