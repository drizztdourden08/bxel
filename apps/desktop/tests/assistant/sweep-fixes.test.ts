/* @layer renderer-app @kind test */
import { buildTools, encodeBase64, EXPORT_FORMAT_VALUES, parseToolInput, toolJsonSchema } from '@bxel/mcp';
import type { ToolName } from '@bxel/mcp';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOOL_HANDLERS } from '../../src/assistant/tool-handlers.constants';
import { APP_COMMANDS } from '../../src/documents/document-host.constants';
import { toolContext } from '../project/tool-context';
import { fieldOf, rowsOf, toolRig } from '../project/project-tool-rig';
import type { ToolRig } from '../project/project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const FOLDER = 'C:/Assistant';

const bank = { name: 'Main', cap: 16, transparent: true, colors: [{ rgb: '#ff0000' }, { rgb: '#00ff00' }] };

const tools = buildTools(APP_COMMANDS);

let current: ToolRig;

type Made = { readonly documentId: string; readonly assetId: string };

const make = async (kind: string, extra: object = {}): Promise<Made> => {
  const made = await current.run('create_document', { name: `tt ${kind}`, kind, bank, ...extra }, []);
  expect(made).toMatchObject({ ok: true });
  return { documentId: String(fieldOf(made, 'documentId')), assetId: String((fieldOf(made, 'asset') as { id: string }).id) };
};

const spriteOf = async (documentId: string): Promise<string> => {
  const doc = await current.run('get_document', { documentId, spriteOffset: 0, spriteLimit: 10 }, []);
  return String(rowsOf(doc, 'sprites')[0]?.spriteId);
};

const parsed = (name: ToolName, raw: unknown): unknown => {
  const spec = tools.find((tool) => tool.name === name);
  if (!spec) throw new Error(`no tool ${name}`);
  const result = parseToolInput(spec, raw);
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
  return result.value;
};

const handled = async (name: ToolName, raw: unknown, call: object = {}) => {
  const handler = TOOL_HANDLERS[name];
  if (!handler) throw new Error(`no handler ${name}`);
  const context = toolContext({ host: current.rig.kit.host, paths: current.rig.kit.paths, documents: current.rig.disk.port, call: { folder: FOLDER, ...call } });
  return handler(parsed(name, raw), context);
};

const revisionOf = (documentId: string): number => current.rig.kit.host.view(documentId as never)?.state.revision ?? 1;

beforeEach(async () => {
  current = await toolRig();
  current.rig.disk.granted.add(FOLDER.toLowerCase());
});

describe('get_session', () => {
  it('lists exactly the export formats the export schema takes', async () => {
    const session = await current.run('get_session', {}, []);
    expect(fieldOf(session, 'exportFormats')).toEqual([...EXPORT_FORMAT_VALUES]);
  });
});

describe('export_document', () => {
  it('writes a gif of an animation under a .gif name', async () => {
    const { documentId, assetId } = await make('animation');
    const input = { documentId, format: 'gif', source: { animationId: assetId }, scale: 1, overwrite: false, fileName: 'tt-anim.gif' };
    const done = await handled('export_document', input, { target: `${FOLDER}/tt-anim.gif` });
    expect(done.outcome).toMatchObject({ ok: true, files: [{ fileName: 'tt-anim.gif' }] });
    const bytes = current.rig.disk.files.get(`${FOLDER}/tt-anim.gif`) as Uint8Array;
    expect(new TextDecoder().decode(bytes.slice(0, 4))).toBe('GIF8');
  });

  it('writes an indexed png of a sprite frame', async () => {
    const { documentId } = await make('sprite', { sprite: { name: 'tt', width: 8, height: 8 } });
    const spriteId = await spriteOf(documentId);
    const input = { documentId, format: 'png-indexed', source: { spriteId }, scale: 2, overwrite: false, fileName: 'tt-index.png' };
    const done = await handled('export_document', input, { target: `${FOLDER}/tt-index.png` });
    expect(done.outcome).toMatchObject({ ok: true });
    const bytes = current.rig.disk.files.get(`${FOLDER}/tt-index.png`) as Uint8Array;
    expect(bytes[25]).toBe(3);
  });

  it('exports a sheet as a png with the same pixels the preview shows', async () => {
    const { documentId, assetId } = await make('sheet');
    const input = { documentId, format: 'png', source: { sheetId: assetId }, scale: 1, overwrite: false, fileName: 'tt-sheet.png' };
    const done = await handled('export_document', input, { target: `${FOLDER}/tt-sheet.png` });
    expect(done.outcome).toMatchObject({ ok: true, files: [{ fileName: 'tt-sheet.png' }] });
    const preview = await handled('render_preview', { documentId, target: { sheetId: assetId }, scale: 1 });
    expect(preview.outcome).toMatchObject({ ok: true });
    expect(preview.images).toHaveLength(1);
    const written = current.rig.disk.files.get(`${FOLDER}/tt-sheet.png`) as Uint8Array;
    expect(preview.images[0]).toBe(encodeBase64(written));
  });

  it('refuses gif for a sheet with a clear error', async () => {
    const { documentId, assetId } = await make('sheet');
    const input = { documentId, format: 'gif', source: { sheetId: assetId }, scale: 1, overwrite: false, fileName: 'tt-sheet.gif' };
    const refused = await handled('export_document', input, { target: `${FOLDER}/tt-sheet.gif` });
    expect(refused.outcome).toMatchObject({ ok: false, error: { code: 'INVALID_OPTION' } });
  });
});

describe('render_preview of a sheet', () => {
  it('draws the sheet and names a resource for it', async () => {
    const { documentId, assetId } = await make('sheet');
    const preview = await handled('render_preview', { documentId, target: { sheetId: assetId }, scale: 2 });
    expect(preview.outcome).toMatchObject({ ok: true, scale: 2 });
    expect(String(fieldOf(preview.outcome, 'uri'))).toContain(`/sheet/${assetId}/preview.png`);
  });

  it('does not find a sheet that is not in the document', async () => {
    const { documentId } = await make('sheet');
    const preview = await handled('render_preview', { documentId, target: { sheetId: 'sht_zzzzzzzzzzzz' }, scale: 1 });
    expect(preview.outcome).toMatchObject({ ok: false, error: { code: 'TARGET_NOT_FOUND' } });
  });
});

describe('mask options on the wire', () => {
  const full = (side: number) => ({ width: side, height: side, bits: encodeBase64(new Uint8Array(side * side).fill(1)) });

  it('takes a base64 mask on pixels.flip and flips the pixels', async () => {
    const { documentId } = await make('sprite', { sprite: { name: 'tt', width: 8, height: 8 } });
    const spriteId = await spriteOf(documentId);
    const targets = { sprites: [spriteId], layers: { by: 'all' }, frames: { by: 'all' } };
    const pixels = encodeBase64(Uint8Array.from([1, 0, 0, 0]));
    const edit = {
      documentId,
      baseRevision: revisionOf(documentId),
      label: 'Flip',
      steps: [
        { name: 'pixels.patch', targets, options: { rect: { x: 0, y: 0, width: 2, height: 2 }, pixels, skipZero: false } },
        { name: 'pixels.flip', targets, options: { axis: 'horizontal', mask: full(8) } },
      ],
    };
    const done = await handled('apply_edits', edit);
    expect(done.outcome).toMatchObject({ ok: true, noop: false });
    const read = await current.run('read_pixels', { documentId, spriteId, layer: 'flattened', rect: { x: 6, y: 0, width: 2, height: 1 } }, []);
    const bytes = String(fieldOf(read, 'pixels'));
    expect(bytes).toBe(encodeBase64(Uint8Array.from([0, 1])));
  });

  it('documents the mask as base64 in the schema', () => {
    const spec = tools.find((tool) => tool.name === 'apply_edits');
    const text = JSON.stringify(toolJsonSchema(spec?.input as never, 'input'));
    expect(text).toContain('width * height bytes');
  });

  it('refuses a mask of the wrong size, naming the step', () => {
    const spec = tools.find((tool) => tool.name === 'apply_edits');
    const targets = { sprites: ['spr_aaaaaaaaaaaa'], layers: { by: 'all' }, frames: { by: 'all' } };
    const bad = { documentId: 'doc_aaaaaaaaaaaa', baseRevision: 1, label: 'x', steps: [{ name: 'pixels.flip', targets, options: { axis: 'horizontal', mask: { width: 8, height: 8, bits: encodeBase64(new Uint8Array(3)) } } }] };
    const result = spec?.input.safeParse(bad);
    expect(result?.success).toBe(false);
  });
});

describe('preview_edits', () => {
  it('returns a picture of the draft when render is asked for, and none otherwise', async () => {
    const { documentId } = await make('sprite', { sprite: { name: 'tt', width: 8, height: 8 } });
    const spriteId = await spriteOf(documentId);
    const targets = { sprites: [spriteId], layers: { by: 'all' }, frames: { by: 'all' } };
    const steps = [{ name: 'pixels.patch', targets, options: { rect: { x: 0, y: 0, width: 1, height: 1 }, pixels: encodeBase64(Uint8Array.from([1])), skipZero: false } }];
    const base = { documentId, baseRevision: revisionOf(documentId), label: 'Dot', steps };
    const plain = await handled('preview_edits', base);
    expect(plain.images).toHaveLength(0);
    const drawn = await handled('preview_edits', { ...base, render: { scale: 2 } });
    expect(drawn.outcome).toMatchObject({ ok: true, mode: 'preview' });
    expect(drawn.images).toHaveLength(1);
    expect(revisionOf(documentId)).toBe(base.baseRevision);
  });

  it('reports the changes a map edit would make', async () => {
    const { documentId, assetId } = await make('tilemap');
    const doc = await current.run('get_document', { documentId, spriteOffset: 0, spriteLimit: 10 }, []);
    const map = rowsOf(doc, 'tilemaps')[0];
    expect(map).toBeDefined();
    const edit = { documentId, baseRevision: revisionOf(documentId), label: 'Grow', steps: [{ name: 'tilemap.resize', targets: null, options: { tilemap: map?.tilemapId, columns: Number(map?.columns) + 1, rows: Number(map?.rows) } }] };
    const preview = await handled('preview_edits', edit);
    expect(preview.outcome).toMatchObject({ ok: true, noop: false });
    expect(fieldOf(preview.outcome, 'changes')).toMatchObject({ tilemaps: [{ id: assetId, kind: 'updated' }] });
  });
});

describe('get_document', () => {
  it('lists the slices, guides, tilesets and tilemaps it holds', async () => {
    const { documentId } = await make('tilemap');
    const sprite = await make('sprite', { sprite: { name: 'tt', width: 8, height: 8 } });
    const spriteId = await spriteOf(sprite.documentId);
    const slice = { name: 'hit', rect: { x: 0, y: 0, width: 4, height: 4 }, pivot: { x2: 2, y2: 2 } };
    const targets = { sprites: [spriteId], layers: { by: 'all' }, frames: { by: 'all' } };
    const done = await handled('apply_edits', { documentId: sprite.documentId, baseRevision: revisionOf(sprite.documentId), label: 'Slice', steps: [{ name: 'slice.add', targets, options: slice }] });
    expect(done.outcome).toMatchObject({ ok: true });
    const withSlice = await current.run('get_document', { documentId: sprite.documentId, spriteOffset: 0, spriteLimit: 10 }, []);
    expect(rowsOf(withSlice, 'sprites')[0]).toMatchObject({ slices: [{ name: 'hit', rect: slice.rect, pivot: slice.pivot, center: null }], guides: { x: [], y: [] } });
    const map = await current.run('get_document', { documentId, spriteOffset: 0, spriteLimit: 10 }, []);
    expect(rowsOf(map, 'tilesets')).toHaveLength(1);
    const tilemap = rowsOf(map, 'tilemaps')[0];
    expect(typeof tilemap?.columns).toBe('number');
    expect(typeof tilemap?.layers).toBe('number');
  });
});
