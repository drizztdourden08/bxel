/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addLinkedFolder } from '../../src/project/add-linked-folder';
import { closeProject } from '../../src/project/close-project';
import { openProject } from '../../src/project/open-project';
import { removeLinkedFolder } from '../../src/project/remove-linked-folder';
import { removeRecentProject } from '../../src/project/remove-recent-project';
import { restoreHeldProjects } from '../../src/project/restore-held-projects';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { manifestOf, rig, ROOT, withManifest } from './project-harness';
import type { Rig } from './project-harness';
import { currentProject, linkFolderAt, openedProject, SHARED, storedManifest } from './project-session';
import { grantOf } from './project-tool-rig';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

let held: Rig;

const messageOf = (outcome: { ok: boolean; message?: string } | null): string => (outcome && !outcome.ok ? (outcome.message ?? '') : '');

beforeEach(() => {
  held = rig();
});

describe('linked folders', () => {
  beforeEach(() => openedProject(held));

  it('adds a folder to the project file with a path relative to the project', async () => {
    expect(await linkFolderAt(held, SHARED)).toEqual({ ok: true });
    expect(storedManifest(held).folders).toMatchObject([{ path: '.' }, { name: 'Shared', path: '../Shared' }]);
    expect(currentProject().folders.map((folder) => [folder.path, folder.granted])).toEqual([[ROOT, true], [SHARED, true]]);
  });

  it('does nothing when the folder window is cancelled', async () => {
    held.disk.picks.folder = null;
    expect(await addLinkedFolder()).toBeNull();
    expect(storedManifest(held).folders).toHaveLength(1);
  });

  it('refuses a folder that is already part of the project and keeps its grant', async () => {
    expect(await linkFolderAt(held, ROOT)).toMatchObject({ ok: false });
    expect(held.disk.revoked).toEqual([]);
  });

  it('refuses a folder inside the project, and takes the grant of that pick back', async () => {
    const outcome = await linkFolderAt(held, `${ROOT}/sub`);
    expect(messageOf(outcome)).toContain('overlap');
    expect(held.disk.revoked).toEqual([`${ROOT}/sub`]);
    expect(storedManifest(held).folders).toHaveLength(1);
  });

  it('removes a linked folder, takes its grant away and resets the settings that pointed at it', async () => {
    await linkFolderAt(held, SHARED);
    const linked = currentProject().manifest.folders[1];
    if (!linked) throw new Error('no linked folder');
    const settings = { ...currentProject().manifest.settings, exports: { folderId: linked.folderId, path: 'out' } };
    useProjectStore.getState().update({ ...currentProject().manifest, settings });
    expect(await removeLinkedFolder(linked.folderId)).toEqual({ ok: true });
    expect(storedManifest(held).folders).toHaveLength(1);
    expect(storedManifest(held).settings.exports).toEqual({ folderId: currentProject().manifest.folders[0]?.folderId, path: '.' });
    expect(currentProject().folders).toHaveLength(1);
    expect(held.disk.revoked).toEqual([SHARED]);
  });

  it('never removes the project folder', async () => {
    const rootId = currentProject().manifest.folders[0]?.folderId ?? '';
    expect(await removeLinkedFolder(rootId)).toMatchObject({ ok: false });
    expect(currentProject().folders).toHaveLength(1);
  });
});

describe('removing a recent project from the list', () => {
  it('drops it from the list, forgets the folder, ends its assistant grant and its restored folders', async () => {
    await openedProject(held);
    const entry = held.values.projectRecents[0];
    if (!entry) throw new Error('no recent project');
    held.values.assistantProjects = [grantOf(entry.projectId, 'edit')];
    const restored = { ...currentProject(), folders: [] };
    await closeProject();
    useProjectStore.getState().setHeld([restored]);
    await removeRecentProject(entry);
    expect(held.values.projectRecents).toEqual([]);
    expect(held.values.assistantProjects).toEqual([]);
    expect(held.disk.forgotten).toEqual([ROOT]);
    expect(useProjectStore.getState().held).toEqual([]);
    expect(held.disk.revoked).toContain(ROOT);
  });
});

describe('restoring the folders of granted projects at launch', () => {
  const grant = (access: 'read' | 'edit' = 'edit') => [grantOf(manifestOf().projectId, access)];

  beforeEach(() => {
    withManifest(held.disk);
    held.disk.remembered.add(ROOT);
  });

  it('holds a project that has a stored grant and a remembered folder, without opening it', async () => {
    held.values.assistantProjects = grant();
    await restoreHeldProjects();
    const { held: restored, project: open } = useProjectStore.getState();
    expect(open).toBeNull();
    expect(restored.map((each) => [each.manifest.name, each.rootRealPath])).toEqual([['Dungeon', ROOT]]);
    expect(held.disk.granted.has(ROOT.toLowerCase())).toBe(true);
  });

  it('skips a project without a grant and one whose folder is not remembered', async () => {
    await restoreHeldProjects();
    held.values.assistantProjects = grant();
    held.disk.remembered.clear();
    await restoreHeldProjects();
    expect(useProjectStore.getState().held).toEqual([]);
    expect(held.disk.granted.size).toBe(0);
  });

  it('takes the folder back when the project file now belongs to another project', async () => {
    held.values.assistantProjects = [grantOf('prj_zzzzzzzzzzzz', 'edit')];
    await restoreHeldProjects();
    expect(useProjectStore.getState().held).toEqual([]);
    expect(held.disk.revoked).toEqual([ROOT]);
  });

  it('leaves out the project that is already open', async () => {
    held.values.assistantProjects = grant();
    held.disk.picks.folder = ROOT;
    await openProject();
    await restoreHeldProjects();
    expect(useProjectStore.getState().held).toEqual([]);
  });
});
