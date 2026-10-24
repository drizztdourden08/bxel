/* @layer tests @kind test */
import { DEFAULT_ENTRY_KINDS, ENTRY_KINDS, entryKindOf, isListableName } from '@bxel/project';
import { describe, expect, it } from 'vitest';

const CASES: readonly (readonly [string, string])[] = [
  ['hero.bxsprite', 'sprite'],
  ['main.bxsheet', 'sheet'],
  ['dawn.bxpalette', 'palette'],
  ['dawn.gpl', 'palette'],
  ['dawn.PAL', 'palette'],
  ['dawn.hex', 'palette'],
  ['set.bxtiles', 'tileset'],
  ['level1.bxmap', 'tilemap'],
  ['Dungeon.bxproject', 'project'],
  ['old.bxel', 'legacy'],
  ['a.png', 'image'],
  ['a.APNG', 'image'],
  ['a.gif', 'image'],
  ['sheet.json', 'data'],
  ['notes.txt', 'other'],
  ['noext', 'other'],
  ['.bxsprite', 'other'],
  ['a.constructor', 'other'],
  ['Dungeon.bxelproject', 'other'],
];

describe('entry kinds', () => {
  it.each(CASES)('sorts %s as %s', (name, kind) => {
    expect(entryKindOf(name)).toBe(kind);
  });

  it('covers every kind', () => {
    expect(new Set(CASES.map(([, kind]) => kind))).toEqual(new Set(ENTRY_KINDS));
  });

  it('shows every kind but other by default', () => {
    expect(DEFAULT_ENTRY_KINDS).toEqual(ENTRY_KINDS.filter((kind) => kind !== 'other'));
  });

  it('lists the new project file and keeps the version 1 manifest hidden', () => {
    expect(isListableName('Dungeon.bxproject')).toBe(true);
    expect(isListableName('hero.bxsprite')).toBe(true);
    expect(isListableName('Dungeon.bxelproject')).toBe(false);
  });
});
