/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import type { Animation } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { animationFacings } from './animation-facings';
import type { AnimationSource } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const facingSource = (animation: Animation, source: AnimationSource): McpResult<AnimationSource> => {
  if (source.facing === undefined) return { ok: true, value: source };
  const tagId = animationFacings(animation)[source.facing];
  if (tagId === undefined) return mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noFacing(source.facing), { path: 'target.facing' });
  return { ok: true, value: { animationId: source.animationId, tagId } };
};

export { facingSource };
