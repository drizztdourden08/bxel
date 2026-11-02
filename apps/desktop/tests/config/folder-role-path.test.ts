/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { folderRolePath } from '../../src/project-config/folder-role-path';

describe('P1 the role folder path of a folder', () => {
  it('is the path below the project folder, with forward slashes', () => {
    expect(folderRolePath('C:\\games\\hero', 'C:\\games\\hero\\art\\sprites')).toBe('art/sprites');
  });

  it('is empty for the project folder itself, which clears the role', () => {
    expect(folderRolePath('C:/games/hero', 'C:/games/hero/')).toBe('');
  });

  it('ignores case in the folder path', () => {
    expect(folderRolePath('C:/Games/Hero', 'c:/games/hero/Art')).toBe('Art');
  });

  it('is null for a folder outside or beside the project folder', () => {
    expect(folderRolePath('C:/games/hero', 'C:/games/heroes/art')).toBeNull();
    expect(folderRolePath('C:/games/hero', 'D:/other')).toBeNull();
  });
});
