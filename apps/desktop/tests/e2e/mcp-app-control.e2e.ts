/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { createMcpSprite } from './support/create-mcp-sprite';
import { MCP_DRAWN, MCP_SIDE } from './support/mcp.constants';
import type { DrawnSprite, McpRig } from './support/mcp-rig.type';
import { openFullRig } from './support/open-full-rig';
import { patchStep } from './support/patch-step';
import { readLayer } from './support/read-layer';
import { useRig } from './support/use-rig';
import { zoomOf } from './support/zoom-of';

const held: { sprite?: DrawnSprite } = {};

const sprite = (): DrawnSprite => {
  if (!held.sprite) throw new Error('no sprite yet');
  return held.sprite;
};

const revisionNow = async ({ link }: McpRig): Promise<number> => Number((await callMcp(link.client, 'get_document', { documentId: sprite().documentId })).data.revision);

const flipLeft = (pixels: Uint8Array): Uint8Array => {
  const out = Uint8Array.from(pixels);
  for (let y = 0; y < MCP_SIDE; y += 1) for (let x = 0; x < 4; x += 1) out[y * MCP_SIDE + x] = pixels[y * MCP_SIDE + (3 - x)] ?? 0;
  return out;
};

const listsAndReadsView = async ({ link }: McpRig): Promise<void> => {
  const names = (await link.client.listTools()).tools.map((tool) => tool.name);
  for (const name of ['list_commands', 'run_command', 'get_view', 'set_view', 'get_history']) expect(names).toContain(name);
  held.sprite = await createMcpSprite(link.client);
  const applied = await callMcp(link.client, 'apply_edits', {
    documentId: sprite().documentId,
    baseRevision: sprite().revision,
    label: 'draw',
    steps: [patchStep(sprite(), MCP_DRAWN)],
  });
  expect(applied.ok).toBe(true);
  const view = await callMcp(link.client, 'get_view');
  expect(view.data).toMatchObject({ ok: true, window: 'visible', visible: true, tool: { id: 'pencil' } });
  const tabs = view.data.tabs as { documentId: string }[];
  expect(tabs.some((tab) => tab.documentId === sprite().documentId)).toBe(true);
};

const focusesAndZooms = async ({ link, session }: McpRig): Promise<void> => {
  const before = (await callMcp(link.client, 'get_view')).data;
  const tab = (before.tabs as { tabId: string; documentId: string }[]).find((each) => each.documentId === sprite().documentId);
  const focused = await callMcp(link.client, 'set_view', { focus: { tabId: tab?.tabId }, zoom: { rect: { x: 0, y: 0, width: 4, height: 4 } } });
  expect(focused.data).toMatchObject({ ok: true, applied: ['focus', 'zoom'], visible: true });
  const after = (await callMcp(link.client, 'get_view')).data;
  const zoom = after.zoom as { percent: number; visible: { x: number; y: number; width: number; height: number } };
  expect(zoom.percent).toBeGreaterThan(((before.zoom as { percent: number } | null)?.percent ?? 0));
  expect(zoom.visible.width).toBeLessThanOrEqual(MCP_SIDE);
  await expect.poll(async () => Math.round((await zoomOf(session)) * 100), { timeout: 10_000 }).toBe(zoom.percent);
};

const runsAMenuCommand = async ({ link }: McpRig): Promise<void> => {
  const listed = await callMcp(link.client, 'list_commands', { query: 'pixel grid' });
  const row = (listed.data.commands as { id: string; enabled: boolean; effect: string; chord: string | null }[]).find((each) => each.id === 'view.toggle_pixel_grid');
  expect(row).toMatchObject({ enabled: true, effect: 'show' });
  const grid = async (): Promise<boolean> => Boolean(((await callMcp(link.client, 'get_view')).data.toggles as { grid: boolean }).grid);
  const before = await grid();
  const ran = await callMcp(link.client, 'run_command', { id: 'view.toggle_pixel_grid' });
  expect(ran.data).toMatchObject({ ok: true, ran: true, viewChanged: true });
  expect(await grid()).toBe(!before);
};

const flipsASelectionAndUndoes = async (rig: McpRig): Promise<void> => {
  const { link, session } = rig;
  const selected = await callMcp(link.client, 'set_view', { selection: { shape: { kind: 'rect', rect: { x: 0, y: 0, width: 4, height: MCP_SIDE } } } });
  expect(selected.data).toMatchObject({ ok: true, selection: { pixels: 4 * MCP_SIDE, bounds: { x: 0, y: 0, width: 4, height: MCP_SIDE } } });
  const revision = await revisionNow(rig);
  const ran = await callMcp(link.client, 'run_command', { id: 'transform.flip_horizontal', revision });
  expect(ran.data).toMatchObject({ ok: true, ran: true });
  expect([...(await readLayer(link.client, sprite()))]).toEqual([...flipLeft(MCP_DRAWN)]);
  expect(await session.page.getByRole('dialog').count()).toBe(0);
  const history = await callMcp(link.client, 'get_history', { documentId: sprite().documentId });
  const entries = history.data.entries as { origin: string; label: string }[];
  expect(entries.at(-1)).toMatchObject({ origin: 'mcp' });
  expect(entries.at(-1)?.label).toContain('Flip');
  const undone = await callMcp(link.client, 'undo', { documentId: sprite().documentId, expectedRevision: await revisionNow(rig) });
  expect(undone.data).toMatchObject({ ok: true, direction: 'undo' });
  expect([...(await readLayer(link.client, sprite()))]).toEqual([...MCP_DRAWN]);
  const redone = await callMcp(link.client, 'undo', { documentId: sprite().documentId, expectedRevision: await revisionNow(rig), direction: 'redo' });
  expect(redone.data).toMatchObject({ ok: true, direction: 'redo' });
  expect([...(await readLayer(link.client, sprite()))]).toEqual([...flipLeft(MCP_DRAWN)]);
};

const rotatesWithoutADialog = async (rig: McpRig): Promise<void> => {
  const { link, session } = rig;
  const without = await callMcp(link.client, 'run_command', { id: 'file.open' });
  expect(without.code).toBe('COMMAND_ARGS');
  const ran = await callMcp(link.client, 'run_command', { id: 'transform.rotate', args: { angle: 45 } });
  expect(ran.data).toMatchObject({ ok: true, ran: true, opened: null });
  expect(await session.page.getByRole('dialog').count()).toBe(0);
  const shown = await callMcp(link.client, 'run_command', { id: 'transform.scale', args: { width: 4, height: 4 }, show: true });
  expect(shown.data).toMatchObject({ ok: true, ran: false, opened: 'dialog:scale' });
  const cancelled = await callMcp(link.client, 'run_command', { id: 'preview.cancel' });
  expect(cancelled.ok).toBe(true);
};

describe('app control: the window is driven live by a program', () => {
  const rig = useRig(openFullRig);
  test('lists the app control tools and reads the view', () => listsAndReadsView(rig()));
  test('focuses a tab and zooms to a region, visibly', () => focusesAndZooms(rig()));
  test('runs a menu command', () => runsAMenuCommand(rig()));
  test('selects, flips a selection, reads the history, undoes and redoes', () => flipsASelectionAndUndoes(rig()));
  test('rotates by args and never opens a modal, opening one for the owner only with show', () => rotatesWithoutADialog(rig()));
});
