/* @layer tests @kind test */
import { PATH_LIMITS, PROJECT_ERROR_CODE, resolveFolders, toStoredFolderPath } from '@bxel/project';
import type { ProjectFolder } from '@bxel/project';
import { describe, expect, it } from 'vitest';
import { sampleManifest } from './sample-manifest';

const ROOT = 'C:/Games/Dungeon';

const folder = (index: number, path: string): ProjectFolder => ({
  folderId: `fld_${String(index).padStart(8, '0')}`,
  name: `Folder ${index}`,
  path,
});

const folders = (...paths: readonly string[]): ProjectFolder[] => [
  folder(0, '.'),
  ...paths.map((path, index) => folder(index + 1, path)),
];

describe('folder resolution', () => {
  it('resolves the root, a relative folder and an absolute folder', () => {
    const result = resolveFolders(sampleManifest().folders, ROOT);
    expect(result).toMatchObject({ ok: true });
    if (result.ok) expect(result.value.map((entry) => entry.path)).toEqual([ROOT, 'D:/Art/palettes']);
    const linked = resolveFolders(folders('../Shared/sprites'), ROOT);
    if (linked.ok) expect(linked.value[1]?.path).toBe('C:/Games/Shared/sprites');
  });

  it.each([
    ['a folder inside the root', folders('sprites')],
    ['a folder inside the root by a dotted path', folders('./a/../sprites')],
    ['the root again', folders('.')],
    ['a folder holding the root', folders('..')],
    ['an absolute path inside the root', folders('c:\\games\\dungeon\\Art')],
    ['two nested linked folders', folders('D:/Art', 'D:/Art/palettes')],
    ['nested folders in another case', folders('D:/Art', 'd:/ART/Palettes/sub')],
    ['two equal linked folders', folders('D:/Art', 'D:\\Art\\')],
  ])('refuses %s', (_label, list) => {
    expect(resolveFolders(list, ROOT)).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.FOLDER_NESTED });
  });

  it('allows siblings that share a name prefix', () => {
    expect(resolveFolders(folders('../Dungeon2', 'D:/Art', 'D:/Art2'), ROOT)).toMatchObject({ ok: true });
  });

  it('allows 16 folders and refuses 17', () => {
    const paths = Array.from({ length: PATH_LIMITS.maxFolders }, (_unused, index) => `D:/Linked${index}`);
    expect(resolveFolders(folders(...paths.slice(0, 15)), ROOT)).toMatchObject({ ok: true });
    expect(resolveFolders(folders(...paths), ROOT)).toMatchObject({
      ok: false,
      code: PROJECT_ERROR_CODE.TOO_MANY_FOLDERS,
    });
  });

  it.each([['C:foo'], ['..\\x'], ['../../../..'], ['x:y']])('refuses the stored path %j', (path) => {
    expect(resolveFolders(folders(path), ROOT)).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.FOLDER_INVALID });
  });

  it('refuses a root that is not absolute', () => {
    expect(resolveFolders(folders(), 'Games/Dungeon')).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.FOLDER_INVALID });
  });
});

describe('stored folder paths', () => {
  it.each([
    ['C:/Games/Dungeon', '.'],
    ['C:/Games/Dungeon/sprites/hero', 'sprites/hero'],
    ['c:\\games\\dungeon\\Sprites', 'Sprites'],
    ['C:/Games/Shared', '../Shared'],
    ['C:/Art/palettes', '../../Art/palettes'],
    ['C:/', '../..'],
    ['D:/Art/palettes', 'D:/Art/palettes'],
    ['//server/share/art', '//server/share/art'],
  ])('stores %s as %s', (target, stored) => {
    expect(toStoredFolderPath(ROOT, target)).toEqual({ ok: true, value: stored });
  });

  it('stores a relative path that resolves back to the folder', () => {
    const stored = toStoredFolderPath(ROOT, 'C:/Art/palettes');
    expect(stored.ok).toBe(true);
    if (stored.ok) {
      const back = resolveFolders(folders(stored.value), ROOT);
      if (back.ok) expect(back.value[1]?.path).toBe('C:/Art/palettes');
    }
  });

  it('refuses paths that are not absolute', () => {
    expect(toStoredFolderPath(ROOT, 'sprites')).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.FOLDER_INVALID });
    expect(toStoredFolderPath('Games', ROOT)).toMatchObject({ ok: false, code: PROJECT_ERROR_CODE.FOLDER_INVALID });
  });
});
