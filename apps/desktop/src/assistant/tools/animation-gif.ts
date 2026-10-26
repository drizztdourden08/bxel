/* @layer renderer-app @kind logic */
import { composeAnimationFrame, findBank } from '@bxel/document';
import type { AnimStep, Animation, Artwork } from '@bxel/document';
import { encodeGif } from '@bxel/formats';
import { MCP_ERROR_CODE, mcpFailure, RENDER_SIDE_MAX } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { bankRgba } from '../../export/bank-rgba';
import type { FramePng } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const grown = (indices: Uint8Array, width: number, height: number, scale: number): Uint8Array => {
  if (scale === 1) return indices;
  const out = new Uint8Array(width * scale * height * scale);
  for (let y = 0; y < height * scale; y += 1) {
    for (let x = 0; x < width * scale; x += 1) out[y * width * scale + x] = indices[Math.floor(y / scale) * width + Math.floor(x / scale)] ?? 0;
  }
  return out;
};

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
      indices: grown(composeAnimationFrame(artwork, animation, step.frameId, step.flip), animation.width, animation.height, scale),
      delayMs: step.durationMs,
    })),
  });
  if (!encoded.ok) return mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, encoded.message);
  return { ok: true, value: { bytes: encoded.bytes, width: animation.width * scale, height: animation.height * scale } };
};

export { animationGif };
