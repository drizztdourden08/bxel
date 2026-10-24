/* @layer renderer-app @kind test */
import { createSwatchSetId } from '@bxel/project';
import type { SwatchSet } from '@bxel/project';
import { beforeEach, describe, expect, it } from 'vitest';
import { bankPlan } from '../../src/palette-source/bank-plan';
import { SOURCE_DEFAULT } from '../../src/palette-source/palette-source.constants';
import { sourceColors } from '../../src/palette-source/source-colors';
import { sourceFromValue } from '../../src/palette-source/source-from-value';
import { sourceGroups } from '../../src/palette-source/source-groups';
import { sourceName } from '../../src/palette-source/source-name';
import { sourceValue } from '../../src/palette-source/source-value';
import { useProjectSetsStore } from '../../src/stores/useProjectSetsStore';
import { buildLibrary } from '../../src/swatch-library/build-library';

const bytes = (length: number): Uint8Array => Uint8Array.from({ length }, (_unused, index) => index + 3);

const warm: SwatchSet = {
  setId: createSwatchSetId(bytes),
  name: 'Warm',
  colors: [
    { rgb: '#ff0000', name: 'Red' },
    { rgb: '#ffaa00', name: 'Amber' },
  ],
};

describe('a swatch set as a palette source', () => {
  const library = buildLibrary([warm], []);

  it('offers the sets after the palettes, grouped by where they come from', () => {
    const groups = sourceGroups(SOURCE_DEFAULT, library);
    expect(groups.map((group) => group.label)).toEqual(['Palettes', 'Platform presets', 'My swatch sets']);
    expect(groups[2]?.options).toEqual([{ value: `set:user:${warm.setId}`, label: 'Set: Warm' }]);
    expect(groups[1]?.options.some((option) => option.value === 'set:builtin:snes-sprite')).toBe(true);
  });

  it('turns a chosen set into a source with its colors and its name', () => {
    const source = sourceFromValue(`set:user:${warm.setId}`, SOURCE_DEFAULT, library);
    expect(source?.kind).toBe('set');
    expect(source && sourceColors(source).map((color) => color.rgb)).toEqual(['#ff0000', '#ffaa00']);
    expect(source && sourceName(source)).toBe('Warm');
    expect(source && sourceValue(source)).toBe(`set:user:${warm.setId}`);
  });

  it('keeps the current source when the set is gone, and still sends a file choice on', () => {
    expect(sourceFromValue('set:user:missing', SOURCE_DEFAULT, library)).toBe(SOURCE_DEFAULT);
    expect(sourceFromValue('file', SOURCE_DEFAULT, library)).toBeNull();
  });

  it('makes a bank from a set, cut at the limit', () => {
    const source = sourceFromValue('set:builtin:gb-dmg', SOURCE_DEFAULT, library);
    if (!source) throw new Error('no source');
    const plan = bankPlan(source, 3, true);
    expect(plan.bank.colors).toHaveLength(2);
    expect(plan.bank.name).toBe('Game Boy');
    expect(plan.dropped).toBe(2);
  });
});

describe('the project swatch sets', () => {
  beforeEach(() => useProjectSetsStore.getState().close());

  it('holds no project at first, and refuses a set while none is open', () => {
    expect(useProjectSetsStore.getState().projectName).toBeNull();
    expect(useProjectSetsStore.getState().put(warm)).toBeNull();
    expect(useProjectSetsStore.getState().sets).toEqual([]);
  });

  it('adds, replaces and drops sets of the open project', () => {
    const store = useProjectSetsStore.getState();
    store.open('Dungeon', []);
    expect(store.put(warm)).toEqual({ ok: true, value: [warm] });
    const renamed = { ...warm, name: 'Hot' };
    useProjectSetsStore.getState().put(renamed);
    expect(useProjectSetsStore.getState().sets).toEqual([renamed]);
    useProjectSetsStore.getState().drop(warm.setId);
    expect(useProjectSetsStore.getState().sets).toEqual([]);
  });

  it('appears in the library as the project group, then leaves with the project', () => {
    useProjectSetsStore.getState().open('Dungeon', [warm]);
    const library = buildLibrary([], useProjectSetsStore.getState().sets);
    expect(library.groups.map((group) => group.origin)).toEqual(['builtin', 'project']);
    useProjectSetsStore.getState().close();
    expect(useProjectSetsStore.getState().sets).toEqual([]);
  });
});
