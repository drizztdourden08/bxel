/* @layer renderer-app @kind test */
import { decodePalette } from '@bxel/document/native';
import { createSwatchSetId, decodeProject } from '@bxel/project';
import type { SwatchSet } from '@bxel/project';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { closeProject } from '../../src/project/close-project';
import { createProject } from '../../src/project/create-project';
import { openProject } from '../../src/project/open-project';
import { setProjectAccess } from '../../src/project/set-project-access';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { bytes, legacyManifestOf, manifestOf, rig, ROOT, withLegacyManifest, withManifest } from './project-harness';
import type { Rig } from './project-harness';
import { confirmAction, openWidget, toast } from './project-mocks';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

const warm: SwatchSet = {
  setId: createSwatchSetId(bytes),
  name: 'Warm',
  colors: [
    { rgb: '#ff0000', name: 'Red' },
    { rgb: '#ffaa00', name: 'Amber' },
  ],
};

const manifestText = (rigged: Rig): Uint8Array => {
  const found = rigged.disk.files.get(`${ROOT}/Dungeon.bxproject`);
  if (!(found instanceof Uint8Array)) throw new Error('no project file on disk');
  return found;
};

const stored = (rigged: Rig) => {
  const decoded = decodeProject(manifestText(rigged));
  if (!decoded.ok) throw new Error(decoded.message);
  return decoded.value.manifest;
};

const pick = (rigged: Rig, folder: string | null): void => {
  rigged.disk.picks.folder = folder;
};

let held: Rig;

beforeEach(() => {
  held = rig();
});

describe('creating a project', () => {
  it('writes the project file in the folder, opens the project and remembers it', async () => {
    held.disk.granted.add(ROOT.toLowerCase());
    expect(await createProject('Dungeon', ROOT)).toEqual({ ok: true });
    const manifest = stored(held);
    expect(manifest.name).toBe('Dungeon');
    expect(manifest.folders).toMatchObject([{ path: '.' }]);
    expect(manifest.assistant.access).toBe('off');
    const open = useProjectStore.getState().project;
    expect(open?.manifest.projectId).toBe(manifest.projectId);
    expect(open?.rootRealPath).toBe(ROOT);
    expect(open?.folders.every((folder) => folder.granted)).toBe(true);
    expect(held.values.projectRecents.map((entry) => entry.name)).toEqual(['Dungeon']);
    expect(openWidget).toHaveBeenCalledWith('project');
  });

  it('refuses a folder that already holds a project and writes nothing', async () => {
    held.disk.granted.add(ROOT.toLowerCase());
    withManifest(held.disk);
    const before = manifestText(held);
    const outcome = await createProject('Other', ROOT);
    expect(outcome?.ok).toBe(false);
    expect(manifestText(held)).toBe(before);
    expect(useProjectStore.getState().project).toBeNull();
  });

  it('refuses a name that breaks the file name rule', async () => {
    held.disk.granted.add(ROOT.toLowerCase());
    const outcome = await createProject('a/b', ROOT);
    expect(outcome?.ok).toBe(false);
    expect(held.disk.writes).toEqual([]);
  });

  it('refuses a folder Bxel was not allowed to write in', async () => {
    const outcome = await createProject('Dungeon', ROOT);
    expect(outcome?.ok).toBe(false);
    expect(useProjectStore.getState().project).toBeNull();
  });
});

describe('opening a project', () => {
  it('reads the project file and opens its workspace', async () => {
    withManifest(held.disk);
    pick(held, ROOT);
    await openProject();
    expect(useProjectStore.getState().project?.manifest.name).toBe('Dungeon');
    expect(Object.values(useWorkspaceStore.getState().workspaces).map((workspace) => workspace.kind)).toEqual(['project']);
    expect(held.values.projectRecents).toHaveLength(1);
    expect(toast).toHaveBeenCalledWith('Opened the project Dungeon.', { variant: 'success' });
  });

  it('does nothing when the folder window is cancelled', async () => {
    pick(held, null);
    await openProject();
    expect(useProjectStore.getState().project).toBeNull();
    expect(toast).not.toHaveBeenCalled();
  });

  it('says so when the folder has no project', async () => {
    held.disk.dirs.add(ROOT);
    pick(held, ROOT);
    await openProject();
    expect(useProjectStore.getState().project).toBeNull();
    expect(toast).toHaveBeenCalledWith(expect.stringContaining('no Bxel project'), { variant: 'danger' });
  });

  it('says so when the project file is damaged', async () => {
    held.disk.files.set(`${ROOT}/Broken.bxelproject`, '{ not json');
    pick(held, ROOT);
    await openProject();
    expect(useProjectStore.getState().project).toBeNull();
    expect(toast).toHaveBeenCalledWith(expect.stringContaining('not valid JSON'), { variant: 'danger' });
  });

  it('starts the folder window at a recent project when it is given the folder', async () => {
    withManifest(held.disk);
    pick(held, ROOT);
    const spy = vi.spyOn(held.disk.port, 'openFolder');
    await openProject(ROOT);
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ defaultPath: ROOT }));
  });

  it('closes the project and its workspace', async () => {
    withManifest(held.disk);
    pick(held, ROOT);
    await openProject();
    await closeProject();
    expect(useProjectStore.getState().project).toBeNull();
    expect(useWorkspaceStore.getState().workspaces).toEqual({});
  });

  it('updates an older project file to the new format, with its swatch sets as palettes', async () => {
    withLegacyManifest(held.disk, legacyManifestOf({ swatchSets: [warm] }));
    pick(held, ROOT);
    await openProject();
    expect(stored(held).name).toBe('Dungeon');
    expect(held.disk.trashed).toEqual([`${ROOT}/Dungeon.bxelproject`]);
    const palette = held.disk.files.get(`${ROOT}/palettes/Warm.bxpalette`);
    expect(decodePalette(palette as Uint8Array).slice?.artwork.banks?.[0]?.name).toBe('Warm');
    expect(toast).toHaveBeenCalledWith('Updated the project file to the new format.', { variant: 'info' });
    const workspace = Object.values(useWorkspaceStore.getState().workspaces)[0];
    expect([...(workspace?.paths.values() ?? [])]).toEqual([`${ROOT}/palettes/Warm.bxpalette`]);
  });
});

describe('the assistant grant when a project opens', () => {
  const opened = async (access: 'off' | 'read' | 'edit'): Promise<void> => {
    withManifest(held.disk, manifestOf({ assistant: { access } }));
    pick(held, ROOT);
    await openProject();
  };

  it('asks once when the project file says edit and nothing is stored for this folder', async () => {
    await opened('edit');
    expect(confirmAction).toHaveBeenCalledTimes(1);
    await vi.waitFor(() => expect(held.values.assistantProjects).toHaveLength(1));
    expect(held.values.assistantProjects[0]).toMatchObject({ rootRealPath: ROOT, access: 'edit' });
  });

  it('stores nothing when the owner keeps it off', async () => {
    confirmAction.mockImplementation(() => Promise.resolve(false));
    await opened('read');
    expect(confirmAction).toHaveBeenCalledTimes(1);
    await Promise.resolve();
    expect(held.values.assistantProjects).toEqual([]);
  });

  it('does not ask when the project file says off', async () => {
    await opened('off');
    expect(confirmAction).not.toHaveBeenCalled();
    expect(held.values.assistantProjects).toEqual([]);
  });

  it('does not ask when a grant is stored for this id and folder', async () => {
    const manifest = manifestOf({ assistant: { access: 'edit' } });
    held.values.assistantProjects = [{ projectId: manifest.projectId, rootRealPath: ROOT, access: 'read', grantedAt: '2026-10-24T10:00:00.000Z' }];
    withManifest(held.disk, manifest);
    pick(held, ROOT);
    await openProject();
    expect(confirmAction).not.toHaveBeenCalled();
  });
});

describe('the grant of the open project', () => {
  it('is stored in the settings and shown in the project file', async () => {
    withManifest(held.disk);
    pick(held, ROOT);
    await openProject();
    const project = useProjectStore.getState().project;
    if (!project) throw new Error('no project');
    const target = { projectId: project.manifest.projectId, rootRealPath: ROOT };
    const port = useProjectStore.getState().port;
    if (!port) throw new Error('no port');
    await setProjectAccess(port, target, 'read');
    expect(held.values.assistantProjects).toMatchObject([{ access: 'read', rootRealPath: ROOT }]);
    expect(stored(held).assistant.access).toBe('read');
    await setProjectAccess(port, target, 'off');
    expect(held.values.assistantProjects).toEqual([]);
    expect(stored(held).assistant.access).toBe('off');
  });
});
