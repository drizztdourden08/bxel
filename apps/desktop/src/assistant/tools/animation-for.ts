/* @layer renderer-app @kind logic */
import { ERROR_CODE, findAnimation } from '@bxel/document';
import type { AnimationId, Animation, Artwork } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { TOOL_TEXT } from './tools.constants';

const animationFor = (artwork: Artwork, animationId: string, hidden: ReadonlySet<string>): McpResult<Animation> => {
  const found = hidden.has(animationId) ? undefined : findAnimation(artwork, animationId as AnimationId);
  return found ? { ok: true, value: found } : mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noAnimation);
};

export { animationFor };
