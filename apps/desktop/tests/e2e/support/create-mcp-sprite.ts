/* @layer renderer-app @kind logic */
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { expect } from 'vitest';
import { callMcp } from './call-mcp';
import { MCP_ARTWORK } from './mcp.constants';
import type { DrawnSprite } from './mcp-rig.type';

const firstOf = (value: unknown, key: string): Record<string, unknown> => {
  const list = typeof value === 'object' && value !== null ? (value as Record<string, unknown>)[key] : undefined;
  const first: unknown = Array.isArray(list) ? list[0] : undefined;
  if (typeof first !== 'object' || first === null) throw new Error(`no ${key} in the document`);
  return first as Record<string, unknown>;
};

const createMcpSprite = async (client: Client): Promise<DrawnSprite> => {
  const created = await callMcp(client, 'create_document', { ...MCP_ARTWORK });
  expect(created.ok).toBe(true);
  const documentId = String(created.data.documentId);
  const document = await callMcp(client, 'get_document', { documentId });
  const sprite = firstOf(document.data, 'sprites');
  return {
    documentId,
    spriteId: String(sprite.spriteId),
    layerId: String(firstOf(sprite, 'layers').layerId),
    frameId: String(firstOf(sprite, 'frames').frameId),
    revision: Number(document.data.revision),
  };
};

export { createMcpSprite };
