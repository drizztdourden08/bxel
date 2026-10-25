/* @layer renderer-app @kind test */
import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { createMcpSprite } from './support/create-mcp-sprite';
import { MCP_DRAWN, MCP_SIDE } from './support/mcp.constants';
import type { DrawnSprite, McpRig } from './support/mcp-rig.type';
import { openMcpRig } from './support/open-mcp-rig';
import { patchStep } from './support/patch-step';
import { readLayer } from './support/read-layer';
import { useRig } from './support/use-rig';

const held: { sprite?: DrawnSprite; bankId?: string } = {};

const sprite = (): DrawnSprite => {
  if (!held.sprite) throw new Error('no sprite yet');
  return held.sprite;
};

const edit = (steps: readonly unknown[]) => ({ documentId: sprite().documentId, baseRevision: sprite().revision, label: 'try', steps });

const addSwatch = (at: number) => ({ name: 'swatch.add', targets: null, options: { bankId: held.bankId, rgb: `#${(at + 16).toString(16).padStart(2, '0')}2030` } });

const unchanged = async ({ link }: McpRig, pixels: Uint8Array, slots: number): Promise<void> => {
  expect([...await readLayer(link.client, sprite())]).toEqual([...pixels]);
  expect((await callMcp(link.client, 'get_document', { documentId: sprite().documentId })).data.revision).toBe(sprite().revision);
  const palette = await callMcp(link.client, 'read_palette', { documentId: sprite().documentId });
  expect((palette.data.slots as unknown[]).length).toBe(slots);
};

const setsUp = async ({ link }: McpRig): Promise<void> => {
  held.sprite = await createMcpSprite(link.client);
  const drawn = await callMcp(link.client, 'apply_edits', edit([patchStep(sprite(), MCP_DRAWN)]));
  expect(drawn.ok).toBe(true);
  held.sprite = { ...sprite(), revision: sprite().revision + 1 };
  held.bankId = String((await callMcp(link.client, 'read_palette', { documentId: sprite().documentId })).data.bankId);
};

const refusesBadPixels = async (rig: McpRig): Promise<void> => {
  const { link } = rig;
  const tooHigh = new Uint8Array(4).fill(9);
  const index = await callMcp(link.client, 'apply_edits', edit([patchStep(sprite(), tooHigh, { x: 0, y: 0, width: 2, height: 2 })]));
  expect(index.code).toBe('INDEX_OUT_OF_RANGE');
  const outside = await callMcp(link.client, 'apply_edits', edit([patchStep(sprite(), new Uint8Array(4).fill(1), { x: MCP_SIDE - 1, y: MCP_SIDE - 1, width: 2, height: 2 })]));
  expect(outside.code).toBe('OUT_OF_BOUNDS');
  const mixed = await callMcp(link.client, 'apply_edits', edit([patchStep(sprite(), new Uint8Array(4).fill(2), { x: 4, y: 4, width: 2, height: 2 }), patchStep(sprite(), tooHigh, { x: 0, y: 0, width: 2, height: 2 })]));
  expect(mixed.isError).toBe(true);
  expect(mixed.data).toMatchObject({ ok: false, error: { step: 1 } });
  await unchanged(rig, MCP_DRAWN, 4);
};

const refusesPaletteGrowthPastTheCap = async (rig: McpRig): Promise<void> => {
  const { link } = rig;
  const tooMany = await callMcp(link.client, 'apply_edits', edit(Array.from({ length: 13 }, (_unused, at) => addSwatch(at))));
  expect(tooMany.code).toBe('PALETTE_FULL');
  await unchanged(rig, MCP_DRAWN, 4);
  const fills = await callMcp(link.client, 'apply_edits', edit(Array.from({ length: 12 }, (_unused, at) => addSwatch(at))));
  expect(fills.ok).toBe(true);
  held.sprite = { ...sprite(), revision: sprite().revision + 1 };
  const full = await callMcp(link.client, 'apply_edits', edit([addSwatch(40)]));
  expect(full.code).toBe('PALETTE_FULL');
  await unchanged(rig, MCP_DRAWN, 16);
};

const refusesLockedLayer = async (rig: McpRig): Promise<void> => {
  const { link } = rig;
  const lock = await callMcp(link.client, 'apply_edits', edit([{ name: 'layer.update', targets: patchStep(sprite(), MCP_DRAWN).targets, options: { layer: { by: 'id', id: sprite().layerId }, locked: true } }]));
  expect(lock.ok).toBe(true);
  held.sprite = { ...sprite(), revision: sprite().revision + 1 };
  const refused = await callMcp(link.client, 'apply_edits', edit([patchStep(sprite(), new Uint8Array(MCP_SIDE * MCP_SIDE).fill(1))]));
  expect(refused.code).toBe('LAYER_LOCKED');
  await unchanged(rig, MCP_DRAWN, 16);
};

const refusesPathsOutsideItsPlace = async ({ link, folder }: McpRig): Promise<void> => {
  const save = (target: unknown) => callMcp(link.client, 'save_document', { documentId: sprite().documentId, target });
  expect((await save({ fileName: 'keep.bxsprite' })).ok).toBe(true);
  const kept = await readFile(join(folder, 'keep.bxsprite'));
  expect((await save({ fileName: 'keep.bxsprite' })).code).toBe('FILE_EXISTS');
  expect(Buffer.compare(await readFile(join(folder, 'keep.bxsprite')), kept)).toBe(0);
  for (const name of ['../escape.bxsprite', '..\\escape.bxsprite', 'C:\\escape.bxsprite', '/tmp/escape.bxsprite']) {
    expect((await save({ fileName: name })).isError, name).toBe(true);
  }
  const unknown = await save({ location: { projectId: 'prj_0000000000aa', folderId: 'fld_0000000000aa', path: 'escape.bxsprite' } });
  expect(unknown.ok).toBe(false);
  expect((await readdir(folder)).filter((name) => name.includes('escape'))).toEqual([]);
  expect((await readdir(join(folder, '..'))).filter((name) => name.includes('escape'))).toEqual([]);
};

describe('check 8: the assistant is refused and nothing is half changed', () => {
  const rig = useRig(openMcpRig);
  test('draws one starting pattern', () => setsUp(rig()));
  test('refuses an index past the palette, pixels outside the sprite and a batch with one bad step', () => refusesBadPixels(rig()));
  test('refuses to grow a palette past its cap, in one batch or by one more swatch', () => refusesPaletteGrowthPastTheCap(rig()));
  test('refuses a stroke on a locked layer', () => refusesLockedLayer(rig()));
  test('refuses to overwrite a file, to leave its folder or to use an unknown project', () => refusesPathsOutsideItsPlace(rig()));
});
