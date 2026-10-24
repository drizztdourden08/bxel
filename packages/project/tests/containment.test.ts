/* @layer tests @kind test */
import { isInside, isSamePath, normalizeAbsolute } from '@bxel/project';
import { describe, expect, it } from 'vitest';

describe('containment', () => {
  it.each([
    ['C:/Games/Dungeon/sprites/a.bxel', 'C:/Games/Dungeon'],
    ['c:\\games\\DUNGEON\\a.bxel', 'C:/Games/Dungeon/'],
    ['C:/Games/Dungeon', 'C:/Games/Dungeon'],
    ['C:/Games/Dungeon/', 'C:\\Games\\Dungeon'],
    ['C:/x', 'C:/'],
    ['/home/art/sprites/a.bxel', '/home/art'],
    ['//server/share/art/a.bxel', '//server/share'],
    ['\\\\?\\C:\\Games\\Dungeon\\a.bxel', 'C:/Games/Dungeon'],
  ])('%s is inside %s', (child, folder) => {
    expect(isInside(child, folder)).toBe(true);
  });

  it.each([
    ['C:/Games/Dungeon2/a.bxel', 'C:/Games/Dungeon'],
    ['C:/Games', 'C:/Games/Dungeon'],
    ['D:/Games/Dungeon/a.bxel', 'C:/Games/Dungeon'],
    ['C:/Games/Dungeon/../Other/a.bxel', 'C:/Games/Dungeon'],
    ['C:/Games/Dungeon/sprites/a.bxel', 'sprites'],
    ['sprites/a.bxel', 'C:/Games/Dungeon'],
    ['//server/other/a.bxel', '//server/share'],
    ['/home/art2/a.bxel', '/home/art'],
    ['C:Games/Dungeon', 'C:/Games'],
  ])('%s is not inside %s', (child, folder) => {
    expect(isInside(child, folder)).toBe(false);
  });

  it('normalizes separators, dots and repeats', () => {
    expect(normalizeAbsolute('C:\\a\\.\\b\\\\c\\..\\d')).toBe('C:/a/b/d');
    expect(normalizeAbsolute('/a/b/')).toBe('/a/b');
    expect(normalizeAbsolute('C:/')).toBe('C:/');
    expect(normalizeAbsolute('C:/..')).toBeUndefined();
    expect(normalizeAbsolute('a/b')).toBeUndefined();
  });

  it('compares real paths without case or separator differences', () => {
    expect(isSamePath('C:/Games/Dungeon', 'c:\\games\\dungeon\\')).toBe(true);
    expect(isSamePath('C:/Games/Dungeon', 'C:/Games/Dungeon2')).toBe(false);
    expect(isSamePath('relative', 'relative')).toBe(false);
  });
});
