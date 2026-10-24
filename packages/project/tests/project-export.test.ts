/* @layer tests @kind test */
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
    const manifest = JSON.parse(must(writeProjectDocument(sampleDocument()))) as Record<string, unknown>;
    manifest['export'] = settings;
    const parsed = parseProjectDocument(JSON.stringify(manifest));
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.code).toBe(PROJECT_ERROR_CODE.MANIFEST_INVALID);
  });
});
