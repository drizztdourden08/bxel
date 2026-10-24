/* @layer tests @kind test */
import {
  createSwatchSetId,
  isSwatchSetId,
  MAX_SET_COLORS,
  MAX_SWATCH_SETS,
  parseManifest,
  parseSwatchSets,
  PROJECT_ERROR_CODE,
  removeSwatchSet,
  upsertSwatchSet,
  writeManifest,
} from '@bxel/project';
import type { SwatchSet } from '@bxel/project';
import { describe, expect, it } from 'vitest';
import { sampleManifest } from './sample-manifest';

const byteAt = (seed: number, index: number): number => {
  if (index === 0) return seed % 32;
  return index === 1 ? Math.floor(seed / 32) : index;
};

const bytes = (seed: number) => (length: number): Uint8Array => Uint8Array.from({ length }, (_unused, index) => byteAt(seed, index));

const setOf = (seed: number, name = 'Dusk'): SwatchSet => ({
  setId: createSwatchSetId(bytes(seed)),
  name,
  colors: [
    { rgb: '#1a1c2c', name: 'Ink' },
    { rgb: '#ffcd75', name: 'Sand' },
  ],
});

const written = (manifest: object): string => {
  const result = writeManifest({ ...sampleManifest(), ...manifest });
  if (!result.ok) throw new Error(result.message);
  return result.value;
};

describe('swatch set ids', () => {
  it('creates and checks the sws prefix', () => {
    const id = createSwatchSetId(bytes(1));
    expect(id).toMatch(/^sws_[0-9a-hjkmnp-tv-z]{12}$/);
    expect(isSwatchSetId(id)).toBe(true);
    expect(isSwatchSetId('fld_7r2k9m4q')).toBe(false);
    expect(isSwatchSetId('sws_')).toBe(false);
  });
});

describe('manifest swatch sets', () => {
  it('reads an old manifest without the field as an empty list', () => {
    const old: Record<string, unknown> = JSON.parse(written({})) as Record<string, unknown>;
    expect('swatchSets' in old).toBe(false);
    const parsed = parseManifest(JSON.stringify(old));
    expect(parsed).toMatchObject({ ok: true, value: { swatchSets: [] } });
  });

  it('leaves the key out of the file when there are no sets', () => {
    expect(written({})).not.toContain('swatchSets');
  });

  it('round trips sets in a stable key order, before the assistant key', () => {
    const sets = [setOf(1), setOf(9, 'Dawn')];
    const output = written({ swatchSets: sets });
    const keys = Object.keys(JSON.parse(output) as object);
    expect(keys).toEqual(['format', 'formatVersion', 'projectId', 'name', 'folders', 'settings', 'swatchSets', 'assistant']);
    expect(parseManifest(output)).toEqual({ ok: true, value: { ...sampleManifest(), swatchSets: sets } });
  });

  it('lowercases colours and keeps names', () => {
    const upper: SwatchSet = { ...setOf(2), colors: [{ rgb: '#FFCD75', name: 'Sand' }] };
    const parsed = parseManifest(written({ swatchSets: [upper] }));
    expect(parsed).toMatchObject({ ok: true, value: { swatchSets: [{ colors: [{ rgb: '#ffcd75', name: 'Sand' }] }] } });
  });

  it('refuses a repeated set id with the field named', () => {
    const result = parseManifest(JSON.stringify({ ...sampleManifest(), swatchSets: [setOf(3), setOf(3, 'Copy')] }));
    expect(result).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.MANIFEST_INVALID });
    if (!result.ok) expect(result.issues.map((issue) => issue.path)).toContain('swatchSets.1.setId');
  });

  it.each([
    ['a bad id', { setId: 'set_1' }],
    ['an empty name', { name: '   ' }],
    ['no colours', { colors: [] }],
    ['a colour that is not a hex', { colors: [{ rgb: 'red', name: 'Red' }] }],
    ['an unknown key', { shade: 'warm' }],
  ])('refuses %s', (_label, change) => {
    const broken = { ...setOf(4), ...change };
    expect(parseManifest(JSON.stringify({ ...sampleManifest(), swatchSets: [broken] })).ok).toBe(false);
    expect(writeManifest({ ...sampleManifest(), swatchSets: [broken as SwatchSet] }).ok).toBe(false);
  });

  it('refuses more than the largest set size', () => {
    const colors = Array.from({ length: MAX_SET_COLORS + 1 }, (_unused, index) => ({ rgb: `#${index.toString(16).padStart(6, '0')}`, name: String(index) }));
    expect(parseManifest(JSON.stringify({ ...sampleManifest(), swatchSets: [{ ...setOf(5), colors }] })).ok).toBe(false);
  });
});

describe('parseSwatchSets', () => {
  it('keeps the valid sets and drops the rest', () => {
    const good = setOf(6);
    const parsed = parseSwatchSets([good, { setId: 'x' }, 7, null, { ...setOf(7), colors: [] }, good]);
    expect(parsed).toEqual([good]);
  });

  it('returns an empty list for anything that is not a list', () => {
    expect(parseSwatchSets(undefined)).toEqual([]);
    expect(parseSwatchSets({ sets: [] })).toEqual([]);
  });

  it('stops at the largest list size', () => {
    const many = Array.from({ length: MAX_SWATCH_SETS + 5 }, (_unused, index) => setOf(index + 10));
    expect(parseSwatchSets(many)).toHaveLength(MAX_SWATCH_SETS);
  });
});

describe('upsertSwatchSet and removeSwatchSet', () => {
  it('adds a new set and replaces one with the same id', () => {
    const first = setOf(11);
    const added = upsertSwatchSet([], first);
    expect(added).toEqual({ ok: true, value: [first] });
    const renamed = { ...first, name: 'Renamed' };
    expect(upsertSwatchSet([first], renamed)).toEqual({ ok: true, value: [renamed] });
  });

  it('refuses an invalid set and a full list', () => {
    expect(upsertSwatchSet([], { ...setOf(12), colors: [] })).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.SWATCH_SET_INVALID });
    const full = Array.from({ length: MAX_SWATCH_SETS }, (_unused, index) => setOf(index + 20));
    expect(upsertSwatchSet(full, setOf(13))).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.TOO_MANY_SWATCH_SETS });
    expect(upsertSwatchSet(full, { ...full[0] as SwatchSet, name: 'Edited' }).ok).toBe(true);
  });

  it('removes a set by id', () => {
    const first = setOf(14);
    const second = setOf(15);
    expect(removeSwatchSet([first, second], first.setId)).toEqual([second]);
  });
});
