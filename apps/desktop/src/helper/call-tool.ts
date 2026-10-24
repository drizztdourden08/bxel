/* @layer helper @kind logic */
import { checkPatchPixels, checkRequestSize, parseToolInput } from '@bxel/mcp';
import type { ToolOutcome, ToolReply, ToolRouteName } from '@bxel/mcp';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { fieldOf } from '../assistant-bridge/field-of';
import { HELPER_TEXT } from './helper.constants';
import type { HelperState } from './helper.type';
import { startBxel } from './start-bxel';
import { stopStarted } from './stop-started';
import { toCallResult } from './to-call-result';

const asReply = (outcome: ToolOutcome): ToolReply => ({ outcome, images: [] });

const stepsOf = (input: unknown): readonly unknown[] => {
  const steps = fieldOf(input, 'steps');
  return Array.isArray(steps) ? (steps as unknown[]) : [];
};

const route = async (state: HelperState, name: string, input: unknown): Promise<ToolReply> => {
  if (name === 'start_bxel') return asReply(await startBxel(state, fieldOf(input, 'window') === 'visible' ? 'visible' : 'headless'));
  const tooLarge = checkRequestSize(input) ?? checkPatchPixels(stepsOf(input));
  if (tooLarge) return asReply(tooLarge);
  const result = await state.session.call(name as ToolRouteName, input);
  if (name === 'stop_bxel' && result.outcome.ok) await stopStarted(state);
  return result;
};

const callTool = async (state: HelperState, name: string, args: unknown): Promise<CallToolResult> => {
  const spec = state.tools.get(name);
  if (!spec) throw new McpError(ErrorCode.InvalidParams, HELPER_TEXT.unknownTool(name));
  const parsed = parseToolInput(spec, args ?? {});
  if (!parsed.ok) return toCallResult(asReply(parsed));
  return toCallResult(await route(state, name, parsed.value));
};

export { callTool };
