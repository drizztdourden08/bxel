/* @layer renderer-app @kind logic */
import { ERROR_CODE, findBank, findSprite } from '@bxel/document';
import type { Artwork, SpriteId } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { SpriteFrame } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const spriteFrame = (artwork: Artwork, spriteId: string, frameId?: string, hidden: ReadonlySet<string> = new Set()): McpResult<SpriteFrame> => {
  const sprite = hidden.has(spriteId) ? undefined : findSprite(artwork, spriteId as SpriteId);
  const bank = sprite ? findBank(artwork, sprite.bankId) : undefined;
  const frame = frameId === undefined ? sprite?.frames[0] : sprite?.frames.find((candidate) => candidate.id === frameId);
  if (!sprite || !bank || !frame) return mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.notFound);
  return { ok: true, value: { sprite, bank, frameId: frame.id } };
};

export { spriteFrame };
