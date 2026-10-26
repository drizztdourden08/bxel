/* @layer renderer-app @kind logic */
import { animationSequence, ERROR_CODE } from '@bxel/document';
import type { AnimStep, Animation, TagId } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { AnimationSource } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const animationSteps = (animation: Animation, source: AnimationSource): McpResult<readonly AnimStep[]> => {
  if (source.frameId !== undefined) {
    const index = animation.frames.findIndex((frame) => frame.id === source.frameId);
    const frame = animation.frames[index];
    return frame ? { ok: true, value: [{ index, frameId: frame.id, durationMs: frame.durationMs, flip: null }] } : mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noAnimation);
  }
  const tagId = (source.tagId ?? null) as TagId | null;
  if (tagId !== null && !animation.tags.some((tag) => tag.id === tagId)) return mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noAnimation);
  const { steps } = animationSequence(animation, tagId);
  return steps.length > 0 ? { ok: true, value: steps } : mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.emptyAnimation);
};

export { animationSteps };
