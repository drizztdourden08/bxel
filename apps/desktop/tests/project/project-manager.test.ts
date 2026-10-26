/* @layer renderer-app @kind test */
import { createProjectId } from '@bxel/project';
import type { RecentProject } from '@bxel/project';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { diskRows } from '../../src/project-manager/disk-rows';
import { inspectProject } from '../../src/project-manager/inspect-project';
import { knownProjects } from '../../src/project-manager/known-projects';
import { projectFacts } from '../../src/project-manager/project-facts';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { openSampleProject } from '../workspace/open-sample-project';
import { manifestOf, rig, ROOT, withManifest } from './project-harness';
import type { Rig } from './project-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

const CAVE = 'C:/Art/Cave';

const caveId = createProjectId((length) => Uint8Array.from({ length }, (_unused, index) => index + 40));

let held: Rig;

const recent = (name: string, root: string): RecentProject => ({
  projectId: name === 'Cave' ? caveId : manifestOf().projectId,
  name,
  rootRealPath: root,
  openedAt: '2026-10-01T00:00:00.000Z',
});

const putCave = (): void => {
  withManifest(held.disk, manifestOf({ name: 'Cave', projectId: caveId }), CAVE);
  held.disk.remembered.add(CAVE);
  held.disk.dirs.add(`${CAVE}/sprites`);
  held.disk.files.set(`${CAVE}/sprites/torch.bxsprite`, 'not a real sprite');
  held.disk.files.set(`${CAVE}/notes.txt`, 'hello');
};

beforeEach(() => {
  held = rig();
});

describe('the projects the manager lists', () => {
  it('joins the recent projects with the open one and marks the open one', async () => {
    await openSampleProject(held);
    const open = useProjectStore.getState().project;
    const listed = knownProjects([recent('Cave', CAVE), recent('Dungeon', ROOT)], [], open);
    expect(listed.map((each) => each.name)).toEqual(['Cave', 'Dungeon']);
    expect(listed.map((each) => each.open)).toEqual([false, true]);
  });

  it('lists a held project once even when it is also a recent one', async () => {
    await openSampleProject(held);
    const open = useProjectStore.getState().project;
    expect(knownProjects([recent('Dungeon', ROOT)], open ? [open] : [], open)).toHaveLength(1);
  });

  it('shows the live name of the open project over the remembered one', async () => {
    await openSampleProject(held);
    const open = useProjectStore.getState().project;
    const [first] = knownProjects([recent('Old name', ROOT)], [], open);
    expect(first?.name).toBe(open?.manifest.name);
  });
});

describe('a project that is not open', () => {
  it('is read from the disk: its manifest and its asset files, and the folders are let go after', async () => {
    putCave();
    const outcome = await inspectProject(held.disk.port, CAVE, []);
    if (!outcome.ok) throw new Error(outcome.message);
    expect(outcome.project.manifest.name).toBe('Cave');
    const rows = diskRows(outcome.project);
    expect(rows.map((row) => `${row.kind}:${row.name}`).sort()).toEqual(['other:notes.txt', 'sprite:torch']);
    expect(held.disk.revoked).toContain(CAVE);
    expect(held.disk.writes).toEqual([]);
  });

  it('keeps a folder that another project in use still holds', async () => {
    putCave();
    await openSampleProject(held);
    const open = useProjectStore.getState().project;
    if (!open) throw new Error('no open project');
    const outcome = await inspectProject(held.disk.port, ROOT, [open]);
    expect(outcome.ok).toBe(true);
    expect(held.disk.revoked).not.toContain(ROOT);
  });

  it('says so when the folder cannot be reached any more', async () => {
    const outcome = await inspectProject(held.disk.port, 'C:/Art/Gone', []);
    expect(outcome.ok).toBe(false);
  });

  it('gives facts the manager can show', () => {
    const facts = projectFacts(manifestOf({ name: 'Cave' }), CAVE, `${CAVE}/Cave.bxproject`);
    expect(facts.map((fact) => fact.label)).toContain('Assistant access');
    expect(facts.find((fact) => fact.label === 'Project file')?.value).toBe('Cave.bxproject');
  });
});
