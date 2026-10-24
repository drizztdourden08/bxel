/* @layer renderer-app @kind logic */
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { expect } from 'vitest';
import { callMcp } from './call-mcp';
import { MCP_SIDE } from './mcp.constants';
import type { DrawnSprite } from './mcp-rig.type';

const readLayer = async (client: Client, sprite: DrawnSprite, layer: 'flattened' | 'layer' = 'layer'): Promise<Uint8Array> => {
  const read = await callMcp(client, 'read_pixels', {
    documentId: sprite.documentId,
    spriteId: sprite.spriteId,
    frameId: sprite.frameId,
    layer: layer === 'flattened' ? 'flattened' : { layerId: sprite.layerId },
    rect: { x: 0, y: 0, width: MCP_SIDE, height: MCP_SIDE },
  });
  expect(read.ok).toBe(true);
  return new Uint8Array(Buffer.from(String(read.data.pixels), 'base64'));
};

export { readLayer };
