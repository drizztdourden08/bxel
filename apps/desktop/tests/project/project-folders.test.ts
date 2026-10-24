/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { closeProject } from '../../src/project/close-project';
import { createProject } from '../../src/project/create-project';
import { openProject } from '../../src/project/open-project';
import { titleInProject } from '../../src/project/title-in-project';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { manifestOf, rig, ROOT, withManifest } from './project-harness';
import type { Rig } from './project-harness';
import { toast } from './project-mocks';
import { currentProject, linkFolderAt, openedProject, SHARED, storedManifest } from './project-session';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let held: Rig;

beforeEach(() => {
  held = rig();
});

describe('closing a project', () => {
  it('takes the folder grant of every folder of the project away', async () => {
    await openedProject(held);
    await linkFolderAt(held, SHARED);
    await closeProject();
    expect(useProjectStore.getState().project).toBeNull();
    expect(held.disk.revoked.map((path) => path.toLowerCase()).sort()).toEqual([ROOT.toLowerCase(), SHARED.toLowerCase()]);
    expect(held.disk.granted.size).toBe(0);
  });

  it('does nothing when no project is open', async () => {
    await closeProject();
    expect(held.disk.revoked).toEqual([]);
  });

  it('takes the folders of the previous project away when another one opens', async () => {
    await openedProject(held);
    withManifest(held.disk, manifestOf({ name: 'Forest', projectId: 'prj_zzzzzzzzzzzz' }), 'C:/Art/Forest');
    held.disk.picks.folder = 'C:/Art/Forest';
    await openProject();
    expect(held.disk.revoked).toEqual([ROOT]);
    expect(currentProject().manifest.name).toBe('Forest');
  });
});

describe('opening a recent project', () => {
  it('restores the grant silently from the remembered folders and skips the folder window', async () => {
    withManifest(held.disk);
    held.disk.remembered.add(ROOT);
    const picker = vi.spyOn(held.disk.port, 'openFolder');
    await openProject(ROOT);
    expect(picker).not.toHaveBeenCalled();
    expect(currentProject().manifest.name).toBe('Dungeon');
    expect(held.disk.granted.has(ROOT.toLowerCase())).toBe(true);
  });

  it('falls back to the folder window only when Brock refuses the folder', async () => {
    withManifest(held.disk);
    held.disk.picks.folder = ROOT;
    const picker = vi.spyOn(held.disk.port, 'openFolder');
    await openProject(ROOT);
    expect(picker).toHaveBeenCalledWith(expect.objectContaining({ defaultPath: ROOT }));
    expect(currentProject().manifest.name).toBe('Dungeon');
  });

  it('says so when the restored folder no longer holds a project', async () => {
    held.disk.dirs.add(ROOT);
    held.disk.remembered.add(ROOT);
    await openProject(ROOT);
    expect(useProjectStore.getState().project).toBeNull();
    expect(toast).toHaveBeenCalledWith(expect.stringContaining('no Bxel project'), { variant: 'danger' });
  });
});

describe('a new project', () => {
  it('makes its role folders up front and names them in the project file', async () => {
    held.disk.granted.add(ROOT.toLowerCase());
    await createProject('Dungeon', ROOT);
    expect(held.disk.made).toEqual(['sprites', 'sheets', 'palettes', 'tilemaps', 'exports'].map((role) => `${ROOT}/${role}`));
    const { folders } = storedManifest(held);
    expect(folders).toMatchObject([{ path: '.', roles: { sprites: 'sprites', exports: 'exports' } }]);
    expect(currentProject().manifest.folders[0]?.roles.exports).toBe('exports');
  });

  it('makes nothing when the folder already holds a project', async () => {
    held.disk.granted.add(ROOT.toLowerCase());
    withManifest(held.disk);
    await createProject('Other', ROOT);
    expect(held.disk.made).toEqual([]);
  });
});

describe('the title of a file in the project', () => {
  it('names the project when the file is inside one of its folders', async () => {
    await openedProject(held);
    expect(titleInProject('hero.bxel', `${ROOT}/sprites/hero.bxel`, currentProject())).toBe('hero.bxel in Dungeon');
    expect(titleInProject('hero.bxel', `${ROOT.replaceAll('/', '\\')}\\hero.bxel`, currentProject())).toBe('hero.bxel in Dungeon');
  });

  it('leaves the name alone for a file elsewhere, an unsaved document or no project', async () => {
    await openedProject(held);
    expect(titleInProject('hero.bxel', 'C:/Other/hero.bxel', currentProject())).toBe('hero.bxel');
    expect(titleInProject('hero.bxel', undefined, currentProject())).toBe('hero.bxel');
    expect(titleInProject('hero.bxel', `${ROOT}/hero.bxel`, null)).toBe('hero.bxel');
  });
});
