/* @layer renderer-app @kind test */
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { decodePng } from '@bxel/formats';
import { describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { createMcpSprite } from './support/create-mcp-sprite';
import { MCP_COLORS, MCP_DRAWN, MCP_TOOL_COUNT } from './support/mcp.constants';
import type { DrawnSprite, McpRig } from './support/mcp-rig.type';
import { mirrorRows } from './support/mirror-rows';
import { openMcpRig } from './support/open-mcp-rig';
import { patchStep } from './support/patch-step';
import { readLayer } from './support/read-layer';
import { useRig } from './support/use-rig';

const held: { sprite?: DrawnSprite } = {};

const sprite = (): DrawnSprite => {
  if (!held.sprite) throw new Error('no sprite yet');
  return held.sprite;
};

const edit = (base: number, steps: readonly unknown[], label = 'draw') => ({ documentId: sprite().documentId, baseRevision: base, label, steps });

const withoutNewIds = (changes: unknown): string => JSON.stringify(changes).replace(/"cel_[0-9a-z]+"/g, '"cel"');

const hexAt = (data: Uint8ClampedArray, at: number): string =>
  `#${[0, 1, 2].map((offset) => (data[at * 4 + offset] ?? 0).toString(16).padStart(2, '0')).join('')}`.toUpperCase();

const listsAndPairs = async ({ link }: McpRig): Promise<void> => {
  const listed = await link.client.listTools();
  expect(listed.tools).toHaveLength(MCP_TOOL_COUNT);
  const session = await callMcp(link.client, 'get_session');
  expect(session.data).toMatchObject({ ok: true, mode: 'edit', instance: { window: 'visible', launchedBy: 'owner' } });
};

const previewThenCommit = async ({ link }: McpRig): Promise<void> => {
  held.sprite = await createMcpSprite(link.client);
  const { revision } = sprite();
  const preview = await callMcp(link.client, 'preview_edits', { ...edit(revision, [patchStep(sprite(), MCP_DRAWN)]), previewPixels: 64 });
  expect(preview.data).toMatchObject({ ok: true, mode: 'preview', revision });
  expect([...(await readLayer(link.client, sprite()))].every((value) => value === 0)).toBe(true);
  const applied = await callMcp(link.client, 'apply_edits', edit(revision, [patchStep(sprite(), MCP_DRAWN)]));
  expect(applied.data).toMatchObject({ ok: true, mode: 'commit', baseRevision: revision, revision: revision + 1 });
  expect(withoutNewIds(applied.data.changes)).toEqual(withoutNewIds(preview.data.changes));
  expect([...(await readLayer(link.client, sprite()))]).toEqual([...MCP_DRAWN]);
  held.sprite = { ...sprite(), revision: revision + 1 };
};

const mirrorAndUndo = async ({ link }: McpRig): Promise<void> => {
  const { revision } = sprite();
  const mirrored = mirrorRows(await readLayer(link.client, sprite()));
  const applied = await callMcp(link.client, 'apply_edits', edit(revision, [patchStep(sprite(), mirrored)], 'mirror'));
  expect(applied.data).toMatchObject({ ok: true, revision: revision + 1 });
  expect([...(await readLayer(link.client, sprite(), 'flattened'))]).toEqual([...mirrored]);
  const undone = await callMcp(link.client, 'undo', { documentId: sprite().documentId, expectedRevision: revision + 1 });
  expect(undone.data).toMatchObject({ ok: true, revision: revision + 2, undone: { origin: 'mcp' } });
  expect([...(await readLayer(link.client, sprite()))]).toEqual([...MCP_DRAWN]);
  const again = await callMcp(link.client, 'apply_edits', edit(revision + 2, [patchStep(sprite(), mirrored)], 'mirror'));
  expect(again.data).toMatchObject({ ok: true, revision: revision + 3 });
  held.sprite = { ...sprite(), revision: revision + 3 };
};

const staleAndInvalid = async ({ link }: McpRig): Promise<void> => {
  const before = await readLayer(link.client, sprite());
  const stale = await callMcp(link.client, 'apply_edits', edit(sprite().revision - 1, [patchStep(sprite(), MCP_DRAWN)]));
  expect(stale.code).toBe('STALE_REVISION');
  expect(stale.data).toMatchObject({ error: { currentRevision: sprite().revision } });
  const outside = patchStep(sprite(), new Uint8Array(4), { x: 7, y: 7, width: 2, height: 2 });
  const invalid = await callMcp(link.client, 'apply_edits', edit(sprite().revision, [patchStep(sprite(), MCP_DRAWN), outside]));
  expect(invalid.isError).toBe(true);
  expect(invalid.data).toMatchObject({ ok: false, error: { step: 1 } });
  expect([...(await readLayer(link.client, sprite()))]).toEqual([...before]);
  const state = await callMcp(link.client, 'get_document', { documentId: sprite().documentId });
  expect(state.data.revision).toBe(sprite().revision);
};

const saveReopenExport = async ({ link, folder }: McpRig): Promise<void> => {
  const pixels = await readLayer(link.client, sprite(), 'flattened');
  const saved = await callMcp(link.client, 'save_document', { documentId: sprite().documentId, target: { fileName: 'check7.bxsprite' } });
  expect(saved.data).toMatchObject({ ok: true, fileName: 'check7.bxsprite', place: { assistantFolder: true } });
  await access(join(folder, 'check7.bxsprite'));
  expect((await callMcp(link.client, 'close_document', { documentId: sprite().documentId })).data).toMatchObject({ ok: true, closed: true });
  const places = await callMcp(link.client, 'list_places');
  const recent = (places.data.recent as { recentId: string; fileName: string }[]).find((entry) => entry.fileName === 'check7.bxsprite');
  const opened = await callMcp(link.client, 'open_file', { file: { recentId: recent?.recentId } });
  expect(opened.data).toMatchObject({ ok: true, alreadyOpen: false, fileName: 'check7.bxsprite' });
  held.sprite = { ...sprite(), documentId: String(opened.data.documentId) };
  expect([...(await readLayer(link.client, sprite(), 'flattened'))]).toEqual([...pixels]);
  const exported = await callMcp(link.client, 'export_document', { documentId: sprite().documentId, format: 'png', source: { spriteId: sprite().spriteId }, fileName: 'check7.png' });
  expect(exported.data).toMatchObject({ ok: true, files: [{ fileName: 'check7.png' }] });
  const png = decodePng(new Uint8Array(await readFile(join(folder, 'check7.png'))));
  if (!png.ok) throw new Error('the export is not a PNG');
  pixels.forEach((index, at) => expect(index === 0 ? png.data[at * 4 + 3] : hexAt(png.data, at)).toBe(index === 0 ? 0 : MCP_COLORS[index - 1]));
};

const refusals = async ({ link, session, sessionId }: McpRig): Promise<void> => {
  await session.page.evaluate(`window.api.assistantSetMode(${JSON.stringify(sessionId)}, 'read')`);
  const refused = await callMcp(link.client, 'apply_edits', edit(sprite().revision, [patchStep(sprite(), MCP_DRAWN)]));
  expect(refused.code).toBe('READ_ONLY_SESSION');
  await session.page.evaluate(`window.api.assistantDisconnect(${JSON.stringify(sessionId)})`);
  expect((await callMcp(link.client, 'list_documents')).code).toBe('SESSION_REVOKED');
  expect(link.stderr()).not.toMatch(/[0-9a-f]{64}/);
};

describe('check 7: a standard MCP client drives Bxel', () => {
  const rig = useRig(openMcpRig);
  test('lists every tool and pairs once the owner approves editing', () => listsAndPairs(rig()));
  test('a preview changes nothing and the same batch then commits as one step', () => previewThenCommit(rig()));
  test('a mirror read and written back lands, and undo takes back exactly that batch', () => mirrorAndUndo(rig()));
  test('a stale revision or one invalid step leaves the whole batch unchanged', () => staleAndInvalid(rig()));
  test('saves, closes, reopens from the recent list and exports the same pixels', () => saveReopenExport(rig()));
  test('refuses edits in read only mode and every call after a disconnect', () => refusals(rig()));
});
