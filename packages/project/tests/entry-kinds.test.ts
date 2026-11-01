/* @layer tests @kind test */
import { entryKindOf, isListableName } from '@bxel/project';
import { describe, expect, it } from 'vitest';

const CASES: readonly (readonly [string, string])[] = [
  ['hero.bxsprite', 'sprite'],
  ['walk.bxanim', 'animation'],
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

describe('K1 entry kinds', { tags: ['critical'] }, () => {
  it.each(CASES)('sorts %s as %s', (name, kind) => {
    expect(entryKindOf(name)).toBe(kind);
  });

  it('lists the new project file and keeps the version 1 manifest hidden', () => {
    expect(isListableName('Dungeon.bxproject')).toBe(true);
    expect(isListableName('hero.bxsprite')).toBe(true);
    expect(isListableName('Dungeon.bxelproject')).toBe(false);
  });
});
