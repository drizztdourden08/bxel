/* @layer renderer-app @kind logic */
import type { AnimStep, Animation, Artwork } from '@bxel/document';
import { MCP_ERROR_CODE, mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { ToolContext } from '../assistant.type';
import { animationFor } from './animation-for';
import { animationStrip } from './animation-strip';
import { animationSteps } from './animation-steps';
import { hiddenAssets } from './hidden-assets';
import type { AnimationSource, AnimationStrip } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

type DrawnAnimation = {
  readonly animation: Animation;
  readonly steps: readonly AnimStep[];
  readonly strip: AnimationStrip;
};

const drawnAnimation = (context: ToolContext, artwork: Artwork, documentId: string, source: AnimationSource): McpResult<DrawnAnimation> => {
  const found = animationFor(artwork, source.animationId, hiddenAssets(context, documentId));
  if (!found.ok) return found;
  const steps = animationSteps(found.value, source);
  if (!steps.ok) return steps;
  const strip = animationStrip(artwork, found.value, steps.value);
  return strip ? { ok: true, value: { animation: found.value, steps: steps.value, strip } } : mcpFailure(MCP_ERROR_CODE.RESULT_TOO_LARGE, TOOL_TEXT.noAnimation);
};

export { drawnAnimation };
export type { DrawnAnimation };
