/* @layer tests @kind test */
import type { ExportPreset, PresetId, SheetId, SpriteId } from '@bxel/document';
import { parseProjectDocument, PROJECT_ERROR_CODE, writeProjectDocument } from '@bxel/project';
import { describe, expect, it } from 'vitest';
import { must } from './must';
import { sampleDocument } from './sample-document';

const KEYS = ['format', 'formatVersion', 'projectId', 'name', 'folders', 'defaults', 'export', 'assistant'];

const JUNK: readonly (readonly [string, unknown])[] = [
  ['a scale of zero', { scale: 0 }],
  ['a scale above the limit', { scale: 9 }],
  ['a scale that is not whole', { scale: 1.5 }],
  ['an empty template', { pathTemplate: '' }],
  ['a template with a folder separator', { pathTemplate: '{sprite}/{frame}' }],
  ['a template with a reserved character', { pathTemplate: '{sprite}:{frame}' }],
  ['an unknown key', { colour: 'rgba' }],
];

describe('the export settings of a project', () => {
  it('are absent from a project that never set them, and the file keeps its version', () => {
    const output = must(writeProjectDocument(sampleDocument()));
    const parsed = JSON.parse(output) as Record<string, unknown>;
    expect(parsed['export']).toBeUndefined();
    expect(parsed['formatVersion']).toBe(2);
    expect(parseProjectDocument(output)).toEqual({ ok: true, value: sampleDocument() });
  });

  it('are written in order after the defaults and read back', () => {
    const document = { ...sampleDocument(), export: { pathTemplate: '{sprite}-{frame}', scale: 4 } };
    const output = must(writeProjectDocument(document));
    expect(Object.keys(JSON.parse(output) as object)).toEqual(KEYS);
    expect(Object.keys((JSON.parse(output) as { export: object }).export)).toEqual(['scale', 'pathTemplate']);
    expect(parseProjectDocument(output)).toEqual({ ok: true, value: document });
  });

  it('may hold the scale or the template alone', () => {
    for (const settings of [{ scale: 2 }, { pathTemplate: '{name}_{frame}' }]) {
      const document = { ...sampleDocument(), export: settings };
      expect(parseProjectDocument(must(writeProjectDocument(document)))).toEqual({ ok: true, value: document });
    }
  });

  it.each(JUNK)('refuse %s', (_label, settings) => {
    const manifest = { ...JSON.parse(must(writeProjectDocument(sampleDocument()))), export: settings } as object;
    expect(parseProjectDocument(JSON.stringify(manifest))).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.MANIFEST_INVALID });
  });
});

const PRESET: ExportPreset = {
  id: 'exp_000001' as PresetId,
  name: 'Web 2x',
  format: 'png',
  scale: 2,
  scope: { sprites: [], layers: { by: 'all' }, frames: { by: 'all' } },
  sheetId: null,
  pathTemplate: '{name}',
  settings: { scale: 2, kind: 'sprite', sprites: 'all' },
};

describe('the export presets of a project', () => {
  it('are written with their keys in a fixed order and read back unchanged', () => {
    const document = { ...sampleDocument(), export: { scale: 2, presets: [PRESET] } };
    const output = must(writeProjectDocument(document));
    const written = (JSON.parse(output) as { export: { presets: object[] } }).export.presets[0] ?? {};
    expect(Object.keys(written)).toEqual(['id', 'name', 'format', 'scale', 'scope', 'sheetId', 'pathTemplate', 'settings']);
    expect(Object.keys((written as { settings: object }).settings)).toEqual(['kind', 'scale', 'sprites']);
    expect(parseProjectDocument(output)).toEqual({ ok: true, value: document });
    expect(must(writeProjectDocument(must(parseProjectDocument(output))))).toBe(output);
  });

  it('may be the only export setting', () => {
    const document = { ...sampleDocument(), export: { presets: [PRESET] } };
    expect(parseProjectDocument(must(writeProjectDocument(document)))).toEqual({ ok: true, value: document });
  });

  it('keep a preset that names sprites or a sheet', () => {
    const named = { ...PRESET, sheetId: 'sht_000002' as SheetId, scope: { ...PRESET.scope, sprites: ['spr_000003' as SpriteId] } };
    const document = { ...sampleDocument(), export: { presets: [named] } };
    expect(parseProjectDocument(must(writeProjectDocument(document)))).toEqual({ ok: true, value: document });
  });

  it('refuse a preset with a bad id or scale', () => {
    for (const bad of [{ ...PRESET, id: 'nope' }, { ...PRESET, scale: 0 }, { ...PRESET, format: 'bmp' }]) {
      const manifest = { ...JSON.parse(must(writeProjectDocument(sampleDocument()))), export: { presets: [bad] } } as object;
      expect(parseProjectDocument(JSON.stringify(manifest))).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.MANIFEST_INVALID });
    }
  });
});
