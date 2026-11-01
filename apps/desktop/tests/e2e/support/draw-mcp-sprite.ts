/* @layer renderer-app @kind logic */
import type { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { callMcp } from './call-mcp';
import { createMcpSprite } from './create-mcp-sprite';
import { MCP_DRAWN } from './mcp.constants';
import type { DrawnSprite } from './mcp-rig.type';
import { patchStep } from './patch-step';

type DrawnResult = { readonly sprite: DrawnSprite; readonly applied: Awaited<ReturnType<typeof callMcp>> };

const drawMcpSprite = async (client: Client): Promise<DrawnResult> => {
  const sprite = await createMcpSprite(client);
  const applied = await callMcp(client, 'apply_edits', { documentId: sprite.documentId, baseRevision: sprite.revision, label: 'draw', steps: [patchStep(sprite, MCP_DRAWN)] });
  return { sprite, applied };
};

export { drawMcpSprite };
