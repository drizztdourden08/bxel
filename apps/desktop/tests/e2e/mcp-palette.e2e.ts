/* @layer renderer-app @kind test */
import { describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { createMcpSprite } from './support/create-mcp-sprite';
import { MCP_COLORS, MCP_DRAWN } from './support/mcp.constants';
import type { DrawnSprite, McpRig } from './support/mcp-rig.type';
import { openMcpRig } from './support/open-mcp-rig';
import { patchStep } from './support/patch-step';
import { readLayer } from './support/read-layer';
import { useRig } from './support/use-rig';

type Slot = { index: number; swatchId: string; hex: string | null };

const held: { sprite?: DrawnSprite; before: string[] } = { before: [] };

const sprite = (): DrawnSprite => {
  if (!held.sprite) throw new Error('no sprite yet');
  return held.sprite;
};

const slotsOf = async ({ link }: McpRig): Promise<{ bankId: string; cap: number; slots: Slot[] }> => {
  const palette = await callMcp(link.client, 'read_palette', { documentId: sprite().documentId });
  return { bankId: String(palette.data.bankId), cap: Number(palette.data.cap), slots: palette.data.slots as Slot[] };
};

const coloursShown = async (rig: McpRig): Promise<string[]> => {
  const { slots } = await slotsOf(rig);
  return [...await readLayer(rig.link.client, sprite())].map((index) => slots[index]?.hex ?? 'transparent');
};

const draws = async (rig: McpRig): Promise<void> => {
  held.sprite = await createMcpSprite(rig.link.client);
  const applied = await callMcp(rig.link.client, 'apply_edits', { documentId: sprite().documentId, baseRevision: sprite().revision, label: 'draw', steps: [patchStep(sprite(), MCP_DRAWN)] });
  expect(applied.ok).toBe(true);
  held.sprite = { ...sprite(), revision: sprite().revision + 1 };
  held.before = await coloursShown(rig);
  expect(new Set(held.before).size).toBe(4);
};

const reordersWithoutChangingTheLook = async (rig: McpRig): Promise<void> => {
  const { bankId, slots } = await slotsOf(rig);
  const order = [0, 3, 2, 1].map((index) => slots[index]?.swatchId);
  const done = await callMcp(rig.link.client, 'apply_edits', { documentId: sprite().documentId, baseRevision: sprite().revision, label: 'reorder', steps: [{ name: 'palette.reorder', targets: null, options: { bankId, order } }] });
  expect(done.ok, JSON.stringify(done.data)).toBe(true);
  held.sprite = { ...sprite(), revision: sprite().revision + 1 };
  const after = await slotsOf(rig);
  expect(after.slots.map((slot) => slot.hex?.toUpperCase() ?? null)).toEqual([null, MCP_COLORS[2], MCP_COLORS[1], MCP_COLORS[0]]);
  expect(after.cap).toBe(16);
  expect([...await readLayer(rig.link.client, sprite())]).toEqual([...MCP_DRAWN].map((index) => [0, 3, 2, 1][index]));
  expect(await coloursShown(rig)).toEqual(held.before);
};

const keepsTheLookThroughSaveAndReopen = async (rig: McpRig): Promise<void> => {
  const { link } = rig;
  const saved = await callMcp(link.client, 'save_document', { documentId: sprite().documentId, target: { fileName: 'order.bxsprite' } });
  expect(saved.ok).toBe(true);
  expect((await callMcp(link.client, 'close_document', { documentId: sprite().documentId })).ok).toBe(true);
  const places = await callMcp(link.client, 'list_places');
  const recent = (places.data.recent as { recentId: string; fileName: string }[]).find((entry) => entry.fileName === 'order.bxsprite');
  const opened = await callMcp(link.client, 'open_file', { file: { recentId: recent?.recentId } });
  held.sprite = { ...sprite(), documentId: String(opened.data.documentId) };
  expect(await coloursShown(rig)).toEqual(held.before);
  expect((await slotsOf(rig)).cap).toBe(16);
};

describe('check 1: reordering swatches keeps every pixel looking the same', () => {
  const rig = useRig(openMcpRig);
  test('draws three colours through the assistant', () => draws(rig()));
  test('reorders the swatches: indices follow, shown colours and the cap stay', () => reordersWithoutChangingTheLook(rig()));
  test('saves, closes and reopens with the same shown colours', () => keepsTheLookThroughSaveAndReopen(rig()));
});
