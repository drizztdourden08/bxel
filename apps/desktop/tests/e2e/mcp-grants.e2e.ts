/* @layer renderer-app @kind test */
import { PRESETS, programKey } from '@bxel/mcp';
import type { Grant } from '@bxel/mcp';
import { ToolListChangedNotificationSchema } from '@modelcontextprotocol/sdk/types.js';
import { describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { createMcpSprite } from './support/create-mcp-sprite';
import { MCP_CLIENT_NAME, MCP_DRAWN, MCP_TOOL_COUNT } from './support/mcp.constants';
import type { DrawnSprite, McpRig } from './support/mcp-rig.type';
import { openMcpRig } from './support/open-mcp-rig';
import { patchStep } from './support/patch-step';
import { useRig } from './support/use-rig';

const held: { sprite?: DrawnSprite; changes: number } = { changes: 0 };

const sprite = (): DrawnSprite => {
  if (!held.sprite) throw new Error('no sprite yet');
  return held.sprite;
};

const newSprite = { name: 'sprite.create', targets: null, options: { name: 'extra', width: 4, height: 4 } };

const edit = (steps: readonly unknown[]) => ({ documentId: sprite().documentId, baseRevision: sprite().revision, label: 'grants', steps });

const narrowed: Grant = {
  ...PRESETS.edit_documents.grant,
  bundles: { ...PRESETS.edit_documents.grant.bundles, sheets_sprites: 'read', files_saving: 'read' },
  tools: { get_animation: 'disabled' },
};

const pushGrant = ({ session }: McpRig, grant: Grant): Promise<unknown> =>
  session.page.evaluate(`window.api.assistantSyncGrants(${JSON.stringify([{ key: programKey(MCP_CLIENT_NAME), grant }])})`);

const namesOf = async ({ link }: McpRig): Promise<string[]> => (await link.client.listTools()).tools.map((tool) => tool.name);

const sprites = async ({ link }: McpRig): Promise<number> => {
  const document = await callMcp(link.client, 'get_document', { documentId: sprite().documentId });
  return (document.data.sprites as unknown[]).length;
};

const setsUp = async (rig: McpRig): Promise<void> => {
  rig.link.client.setNotificationHandler(ToolListChangedNotificationSchema, () => {
    held.changes += 1;
  });
  expect(await namesOf(rig)).toHaveLength(MCP_TOOL_COUNT);
  held.sprite = await createMcpSprite(rig.link.client);
  const session = await callMcp(rig.link.client, 'get_session');
  expect(session.data).toMatchObject({ ok: true, mode: 'edit' });
};

const narrowsAndHidesTheTool = async (rig: McpRig): Promise<void> => {
  await pushGrant(rig, narrowed);
  await expect.poll(async () => (await namesOf(rig)).includes('get_animation'), { timeout: 15_000 }).toBe(false);
  expect(held.changes).toBeGreaterThan(0);
  const names = await namesOf(rig);
  expect(names).toContain('get_document');
  expect(names).toContain('apply_edits');
  const listed = (await rig.link.client.listTools()).tools;
  expect(listed.find((tool) => tool.name === 'apply_edits')?.description).toContain('Sheets and sprites (Read)');
};

const refusesWritesAtRead = async (rig: McpRig): Promise<void> => {
  const { client } = rig.link;
  const before = await sprites(rig);
  const batch = await callMcp(client, 'apply_edits', edit([patchStep(sprite(), MCP_DRAWN), newSprite]));
  expect(batch.code).toBe('READ_LEVEL');
  expect(batch.data).toMatchObject({ error: { step: 1 } });
  expect(JSON.stringify(batch.data)).toContain('Sheets and sprites is set to Read');
  expect(await sprites(rig)).toBe(before);
  expect((await callMcp(client, 'get_document', { documentId: sprite().documentId })).data.revision).toBe(sprite().revision);
  const preview = await callMcp(client, 'preview_edits', edit([newSprite]));
  expect(preview.ok).toBe(true);
  const allowed = await callMcp(client, 'apply_edits', edit([patchStep(sprite(), MCP_DRAWN)]));
  expect(allowed.ok).toBe(true);
  held.sprite = { ...sprite(), revision: sprite().revision + 1 };
};

const refusesBundleAndDisabledByName = async ({ link }: McpRig): Promise<void> => {
  const saved = await callMcp(link.client, 'save_document', { documentId: sprite().documentId, target: { fileName: 'grants.bxsprite' } });
  expect(saved.code).toBe('READ_LEVEL');
  expect(JSON.stringify(saved.data)).toContain('save_document needs Edit. Files and saving is set to Read for this program.');
  const hidden = await callMcp(link.client, 'get_animation', { documentId: sprite().documentId, animationId: 'anm_0000000000aa' });
  expect(hidden.code).toBe('TOOL_DISABLED');
  expect(JSON.stringify(hidden.data)).toContain('get_animation is turned off for bxel-check7');
};

const widensAgain = async (rig: McpRig): Promise<void> => {
  await pushGrant(rig, PRESETS.full_control.grant);
  await expect.poll(async () => (await namesOf(rig)).includes('get_animation'), { timeout: 15_000 }).toBe(true);
  const saved = await callMcp(rig.link.client, 'save_document', { documentId: sprite().documentId, target: { fileName: 'grants.bxsprite' } });
  expect(saved.ok).toBe(true);
  const current = await callMcp(rig.link.client, 'get_document', { documentId: sprite().documentId });
  held.sprite = { ...sprite(), revision: Number(current.data.revision) };
  const batch = await callMcp(rig.link.client, 'apply_edits', edit([newSprite]));
  expect(batch.ok, JSON.stringify(batch.data)).toBe(true);
};

describe('per program grants: a narrowed bundle hides a tool and refuses a write', () => {
  const rig = useRig(openMcpRig);
  test('lists every tool and pairs with the editing preset', () => setsUp(rig()));
  test('narrowing the grant removes a tool from the list and tells the client', () => narrowsAndHidesTheTool(rig()));
  test('a batch with one step in a Read bundle applies nothing, and the other bundles still work', () => refusesWritesAtRead(rig()));
  test('a Read bundle refuses a save naming it, and a disabled tool is refused by name', () => refusesBundleAndDisabledByName(rig()));
  test('widening the grant brings the tool back and the writes work', () => widensAgain(rig()));
});
