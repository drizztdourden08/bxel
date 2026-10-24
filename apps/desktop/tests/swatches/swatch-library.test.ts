/* @layer renderer-app @kind test */
import { createSwatchSetId, MAX_SET_COLORS, MAX_SET_NAME } from '@bxel/project';
import type { SwatchSet } from '@bxel/project';
import { describe, expect, it } from 'vitest';
import type { SourceColor } from '../../src/palette-source/palette-source.type';
import { builtinSets } from '../../src/swatch-library/builtin-sets';
import { buildLibrary } from '../../src/swatch-library/build-library';
import { findLibrarySet } from '../../src/swatch-library/find-library-set';
import { makeSwatchSet } from '../../src/swatch-library/make-swatch-set';
import { recolorSet } from '../../src/swatch-library/recolor-set';
import { withAddedColor } from '../../src/swatch-library/with-added-color';
import { withColor } from '../../src/swatch-library/with-color';
import { withName } from '../../src/swatch-library/with-name';
import type { LibrarySet } from '../../src/swatch-library/swatch-library.type';
import { withoutColor } from '../../src/swatch-library/without-color';

const bytes = (length: number): Uint8Array => Uint8Array.from({ length }, (_unused, index) => index + 1);

const color = (rgb: string, name = rgb): SourceColor => ({ rgb, name });

const allRgbs = (sets: readonly LibrarySet[]): string[] => sets.flatMap((set) => set.colors.map((each) => each.rgb));

const small =(): SwatchSet => makeSwatchSet('Dusk', [color('#111111'), color('#222222', 'Grey')], [], bytes);

describe('the built-in sets', () => {
  const sets = builtinSets();

  it('has one set per platform preset, with unique keys', () => {
    expect(sets).toHaveLength(20);
    expect(new Set(sets.map((set) => set.key)).size).toBe(20);
    expect(sets.every((set) => set.origin === 'builtin' && set.setId === null)).toBe(true);
  });

  it('holds only opaque hex colours, without the transparent slot', () => {
    const snes = sets.find((set) => set.key === 'builtin:snes-sprite');
    expect(snes?.name).toBe('SNES sprite 4bpp');
    expect(snes?.colors).toHaveLength(15);
    expect(allRgbs(sets).every((rgb) => /^#[0-9a-f]{6}$/.test(rgb))).toBe(true);
  });

  it('keeps the fixed colours of a fantasy console', () => {
    const pico = sets.find((set) => set.key === 'builtin:pico-8');
    expect(pico?.colors).toHaveLength(16);
    expect(pico?.colors[1]?.rgb).toBe('#1d2b53');
  });
});

describe('the library groups', () => {
  it('lists the built-in, user and project sets, and skips an empty group', () => {
    const user = small();
    const onlyBuiltin = buildLibrary([], []);
    expect(onlyBuiltin.groups.map((group) => group.origin)).toEqual(['builtin']);
    const all = buildLibrary([user], [user]);
    expect(all.groups.map((group) => group.label)).toEqual(['Platform presets', 'My swatch sets', 'This project']);
    expect(all.user[0]?.key).toBe(`user:${user.setId}`);
    expect(all.project[0]?.key).toBe(`project:${user.setId}`);
  });

  it('finds a set by its key and returns null for an unknown key', () => {
    const user = small();
    const library = buildLibrary([user], []);
    expect(findLibrarySet(library, `user:${user.setId}`)?.name).toBe('Dusk');
    expect(findLibrarySet(library, 'builtin:gb-dmg')?.colors).toHaveLength(4);
    expect(findLibrarySet(library, 'user:nope')).toBeNull();
  });
});

describe('making and editing a set', () => {
  it('makes a set with a fresh id, a free name and at most the largest size', () => {
    const made = makeSwatchSet('Dusk', [color('#000000')], ['dusk'], bytes);
    expect(made.setId).toBe(createSwatchSetId(bytes));
    expect(made.name).toBe('Dusk_2');
    const many = Array.from({ length: MAX_SET_COLORS + 10 }, (_unused, index) => color(`#${index.toString(16).padStart(6, '0')}`));
    expect(makeSwatchSet('Big', many, [], bytes).colors).toHaveLength(MAX_SET_COLORS);
    expect(makeSwatchSet('   ', [color('#000000')], [], bytes).name).toBe('New set');
    expect(makeSwatchSet('x'.repeat(100), [color('#000000')], [], bytes).name).toHaveLength(MAX_SET_NAME);
  });

  it('renames, but keeps the old name for a blank one', () => {
    const set = small();
    expect(withName(set, 'Dawn').name).toBe('Dawn');
    expect(withName(set, '   ')).toBe(set);
  });

  it('adds a colour up to the largest size', () => {
    const set = small();
    expect(withAddedColor(set, { rgb: '#808080', name: 'Mid' }).colors).toHaveLength(3);
    const full = { ...set, colors: Array.from({ length: MAX_SET_COLORS }, () => ({ rgb: '#000000', name: 'k' })) };
    expect(withAddedColor(full, { rgb: '#ffffff', name: 'w' })).toBe(full);
  });

  it('removes a colour but keeps the last one', () => {
    const set = small();
    expect(withoutColor(set, 0).colors.map((each) => each.rgb)).toEqual(['#222222']);
    const single = withoutColor(set, 0);
    expect(withoutColor(single, 0)).toBe(single);
  });

  it('recolors and renames a colour, and follows the value while the name is the value', () => {
    const set = small();
    const recolored = recolorSet(set, 0, '#ABCDEF');
    expect(recolored.colors[0]).toEqual({ rgb: '#abcdef', name: '#abcdef' });
    const named = recolorSet(set, 1, '#ABCDEF');
    expect(named.colors[1]).toEqual({ rgb: '#abcdef', name: 'Grey' });
    expect(withColor(set, 1, { name: 'Steel' }).colors[1]).toEqual({ rgb: '#222222', name: 'Steel' });
  });
});
