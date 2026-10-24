/* @layer core @kind logic */
import type { McpResult } from '../errors/error.type';
import { inputFailure } from '../errors/input-failure';
import type { ToolSpec } from './tool.type';

const parseToolInput = (tool: ToolSpec, raw: unknown): McpResult<unknown> => {
  const parsed = tool.input.safeParse(raw);
  return parsed.success ? { ok: true, value: parsed.data } : inputFailure(parsed.error);
};

export { parseToolInput };
