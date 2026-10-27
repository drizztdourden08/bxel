/* @layer renderer-app @kind test */
import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, test } from 'vitest';
import { callMcp } from './support/call-mcp';
import { MCP_ARTWORK } from './support/mcp.constants';
import type { McpRig } from './support/mcp-rig.type';
import { openMcpRig } from './support/open-mcp-rig';
import { useRig } from './support/use-rig';

type Made = { readonly documentId: string; readonly assetId: string };

const exists = (path: string): Promise<boolean> => access(path).then(() => true, () => false);

const make = async ({ link }: McpRig, kind: string, name: string): Promise<Made> => {
  const created = await callMcp(link.client, 'create_document', { name, kind, bank: MCP_ARTWORK.bank, ...(kind === 'sprite' ? { sprite: MCP_ARTWORK.sprite } : {}) });
  expect(created.data, JSON.stringify(created.data)).toMatchObject({ ok: true });
  return { documentId: String(created.data.documentId), assetId: String((created.data.asset as { id: string }).id) };
};

const dialogs = ({ session }: McpRig): Promise<string[]> => session.page.locator('[role="dialog"]:not([aria-hidden="true"])').evaluateAll((nodes) => nodes.map((node) => node.outerHTML.slice(0, 300)));

const saveTo = ({ link }: McpRig, documentId: string, fileName: string) =>
  callMcp(link.client, 'save_document', { documentId, target: { fileName } });

const savesSheetAndTilemapAtOnce = async (rig: McpRig): Promise<void> => {
  const sheet = await make(rig, 'sheet', 'ttsheet');
  const map = await make(rig, 'tilemap', 'tttilemap');
  const started = Date.now();
  const [sheetSaved, mapSaved] = await Promise.all([saveTo(rig, sheet.documentId, 'tt-sheet.bxsheet'), saveTo(rig, map.documentId, 'tt-tilemap.bxmap')]);
  expect(sheetSaved.data, JSON.stringify(sheetSaved.data)).toMatchObject({ ok: true, fileName: 'tt-sheet.bxsheet', alsoSaved: [{ asset: { kind: 'sprite' } }] });
  expect(mapSaved.data, JSON.stringify(mapSaved.data)).toMatchObject({ ok: true, fileName: 'tt-tilemap.bxmap', alsoSaved: [{ asset: { kind: 'tileset' } }] });
  expect(Date.now() - started).toBeLessThan(60_000);
  for (const name of ['tt-sheet.bxsheet', 'tt-tilemap.bxmap']) expect(await exists(join(rig.folder, name))).toBe(true);
  const alsoSheet = (sheetSaved.data.alsoSaved as { fileName: string }[])[0]?.fileName ?? '';
  const alsoMap = (mapSaved.data.alsoSaved as { fileName: string }[])[0]?.fileName ?? '';
  expect(await exists(join(rig.folder, alsoSheet))).toBe(true);
  expect(await exists(join(rig.folder, alsoMap))).toBe(true);
  expect(await dialogs(rig)).toEqual([]);
};

const exportsGif = async (rig: McpRig): Promise<void> => {
  const animation = await make(rig, 'animation', 'ttanim');
  const exported = await callMcp(rig.link.client, 'export_document', {
    documentId: animation.documentId,
    format: 'gif',
    source: { animationId: animation.assetId },
    fileName: 'tt-anim.gif',
  });
  expect(exported.data, JSON.stringify(exported.data)).toMatchObject({ ok: true, files: [{ fileName: 'tt-anim.gif' }] });
  const bytes = await readFile(join(rig.folder, 'tt-anim.gif'));
  expect(bytes.subarray(0, 4).toString('latin1')).toBe('GIF8');
  const refused = await callMcp(rig.link.client, 'export_document', {
    documentId: animation.documentId,
    format: 'gif',
    source: { animationId: animation.assetId },
    fileName: 'tt-anim.png',
  });
  expect(refused.ok).toBe(false);
};

const previewsAndExportsASheet = async (rig: McpRig): Promise<void> => {
  const sheet = await make(rig, 'sheet', 'ttsheet2');
  const preview = await callMcp(rig.link.client, 'render_preview', { documentId: sheet.documentId, target: { sheetId: sheet.assetId }, scale: 2 });
  expect(preview.data, JSON.stringify(preview.data)).toMatchObject({ ok: true, scale: 2 });
  expect(Number(preview.data.width)).toBeGreaterThan(0);
  const exported = await callMcp(rig.link.client, 'export_document', {
    documentId: sheet.documentId,
    format: 'png',
    source: { sheetId: sheet.assetId },
    fileName: 'tt-sheet-export.png',
  });
  expect(exported.data, JSON.stringify(exported.data)).toMatchObject({ ok: true, files: [{ fileName: 'tt-sheet-export.png' }] });
  expect(await exists(join(rig.folder, 'tt-sheet-export.png'))).toBe(true);
};

describe('an assistant call never opens a dialog', () => {
  const rig = useRig(openMcpRig);
  test('two saves at once write their assets beside them and leave the window free', () => savesSheetAndTilemapAtOnce(rig()));
  test('a gif export takes and writes a .gif file', () => exportsGif(rig()));
  test('a sheet previews and exports as png', () => previewsAndExportsASheet(rig()));
});
