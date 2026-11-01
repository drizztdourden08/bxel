/* @layer renderer-app @kind logic */
import { ERROR_CODE } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import { layersOnly } from './layers-only';
import type { SpriteFrame } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const narrowFrame = (frame: SpriteFrame, layers: readonly string[] | undefined): McpResult<SpriteFrame> => {
  if (layers === undefined) return { ok: true, value: frame };
  const sprite = layersOnly(frame.sprite, layers);
  if (!sprite) return mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.noLayerFound, { path: 'layers' });
  return { ok: true, value: { ...frame, sprite } };
};

export { narrowFrame };
