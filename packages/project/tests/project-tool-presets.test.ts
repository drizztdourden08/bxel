/* @layer tests @kind test */
import { parseProjectDocument, writeProjectDocument } from '@bxel/project';
import { describe, expect, it } from 'vitest';
import { must } from './must';
import { sampleDocument } from './sample-document';

const PRESET = { id: 'user.chunky', name: 'Chunky', member: 'pencil', fields: { 'brush.size': 4, 'brush.pixelPerfect': true } };

describe('K2 the tool presets of a project', { tags: ['critical'] }, () => {
  it('are absent from a project that never saved one', () => {
    const parsed = JSON.parse(must(writeProjectDocument(sampleDocument()))) as Record<string, unknown>;
    expect(parsed['toolPresets']).toBeUndefined();
  });

  it('are written after the defaults and read back', () => {
    const document = { ...sampleDocument(), toolPresets: [PRESET] };
    const output = must(writeProjectDocument(document));
    expect(Object.keys((JSON.parse(output) as { toolPresets: { fields: object }[] }).toolPresets[0]?.fields ?? {})).toEqual(['brush.pixelPerfect', 'brush.size']);
    expect(parseProjectDocument(output)).toEqual({ ok: true, value: document });
  });

  it('drop an empty list instead of writing it', () => {
    const parsed = JSON.parse(must(writeProjectDocument({ ...sampleDocument(), toolPresets: [] }))) as Record<string, unknown>;
    expect(parsed['toolPresets']).toBeUndefined();
  });

  it('refuse a preset with no name, an unknown key or a field that is not a value', () => {
    for (const bad of [{ ...PRESET, name: '' }, { ...PRESET, colour: 'red' }, { ...PRESET, fields: { size: [1] } }]) {
      expect(writeProjectDocument({ ...sampleDocument(), toolPresets: [bad] } as never).ok).toBe(false);
    }
  });
});
