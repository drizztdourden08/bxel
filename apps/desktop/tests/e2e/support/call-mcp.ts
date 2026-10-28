/* @layer renderer-app @kind logic */
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import type { CallOutcome, Structured } from './mcp.type';

const codeOf = (data: Structured): string | null => {
  const error = data.error;
  if (typeof error !== 'object' || error === null || !('code' in error)) return null;
  return typeof error.code === 'string' ? error.code : null;
};

const callMcp = async (client: Client, name: string, args: Record<string, unknown> = {}, timeout?: number): Promise<CallOutcome> => {
  const result = await client.callTool({ name, arguments: args }, undefined, timeout === undefined ? undefined : { timeout });
  const raw: unknown = result.structuredContent;
  const data: Structured = typeof raw === 'object' && raw !== null ? { ...raw } : {};
  return { ok: data.ok === true, data, code: codeOf(data), isError: result.isError === true };
};

export { callMcp };
