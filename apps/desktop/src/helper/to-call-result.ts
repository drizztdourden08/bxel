/* @layer helper @kind logic */
import { toToolResult } from '@bxel/mcp';
import type { ToolReply } from '@bxel/mcp';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { fieldOf } from '../assistant-bridge/field-of';
import { HELPER_TEXT } from './helper.constants';

const linkOf = (reply: ToolReply): CallToolResult['content'] => {
  const uri = reply.outcome.ok ? fieldOf(reply.outcome, 'uri') : undefined;
  return typeof uri === 'string' ? [{ type: 'resource_link', uri, name: HELPER_TEXT.previewName, mimeType: 'image/png' }] : [];
};

const toCallResult = (reply: ToolReply): CallToolResult => {
  const base = toToolResult(reply.outcome, JSON.stringify(reply.outcome));
  const images = reply.images.map((data) => ({ type: 'image' as const, data, mimeType: 'image/png' }));
  return {
    content: [...base.content, ...images, ...linkOf(reply)],
    structuredContent: { ...base.structuredContent },
    ...(base.isError ? { isError: true } : {}),
  };
};

export { toCallResult };
