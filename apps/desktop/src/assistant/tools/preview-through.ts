/* @layer renderer-app @kind logic */
import { ERROR_CODE, findBank } from '@bxel/document';
import type { Artwork, BankId } from '@bxel/document';
import { mcpFailure } from '@bxel/mcp';
import type { McpResult } from '@bxel/mcp';
import type { SpriteFrame } from './tool-input.type';
import { TOOL_TEXT } from './tools.constants';

const previewThrough = (artwork: Artwork, frame: SpriteFrame, bankId: string | undefined): McpResult<SpriteFrame> => {
  if (bankId === undefined || bankId === frame.bank.id) return { ok: true, value: frame };
  const other = findBank(artwork, bankId as BankId);
  if (!other) return mcpFailure(ERROR_CODE.TARGET_NOT_FOUND, TOOL_TEXT.bankNotFound, { path: 'bankId' });
  if (other.slots.length < frame.bank.slots.length) return mcpFailure(ERROR_CODE.INVALID_OPTION, TOOL_TEXT.bankTooSmall(frame.bank.slots.length), { path: 'bankId' });
  return { ok: true, value: { ...frame, bank: other } };
};

export { previewThrough };
