/* @layer renderer-app @kind test */
import { createProjectId } from '@bxel/project';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { openProject } from '../../src/project/open-project';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { artworkOf, openSampleProject, workspaceOf } from '../workspace/open-sample-project';
import { paintSprite } from '../workspace/workspace-harness';
import { manifestOf, rig, ROOT, withManifest } from './project-harness';
import type { Rig } from './project-harness';
import { confirmSave } from './project-mocks';

vi.mock('@drizztdourden08/brock-react', async () => (await import('./project-mocks')).brockReactMock());

const CAVE = 'C:/Art/Cave';

let held: Rig;

const caveId = createProjectId((length) => Uint8Array.from({ length }, (_unused, index) => index + 40));

const paintedDungeon = async () => {
  const { documentId, paths } = await openSampleProject(held);
  const sprite = artworkOf(documentId).sprites[0];
  if (!sprite) throw new Error('no sprite');
  paintSprite(documentId, sprite.id);
  const caveFile = withManifest(held.disk, manifestOf({ name: 'Cave', projectId: caveId }), CAVE);
  return { documentId, path: paths.get(sprite.id) ?? '', caveFile, caveBytes: held.disk.files.get(caveFile) };
};

const openCave = async (): Promise<void> => {
  held.disk.picks.folder = CAVE;
  await openProject();
};

beforeEach(() => {
  held = rig();
  confirmSave.mockClear();
});

describe('opening a second project while one has unsaved work', () => {
  it('saves the first project into its own files, with its grants, before the second one opens', async () => {
    const { path, caveFile, caveBytes } = await paintedDungeon();
    confirmSave.mockResolvedValueOnce('save');
    await openCave();
    expect(held.disk.writes).toContain(path);
    expect(held.disk.files.get(caveFile)).toBe(caveBytes);
    expect(held.disk.revoked).toContain(ROOT);
    expect(useProjectStore.getState().project?.manifest.name).toBe('Cave');
    expect(Object.values(useWorkspaceStore.getState().workspaces).map((each) => each.name)).toEqual(['Cave']);
  });

  it('keeps the first project open, grants and edits included, when the question is cancelled', async () => {
    const { documentId } = await paintedDungeon();
    confirmSave.mockResolvedValueOnce('cancel');
    await openCave();
    expect(useProjectStore.getState().project?.manifest.name).toBe('Dungeon');
    expect(held.disk.revoked).toEqual([]);
    expect(workspaceOf(documentId).dirty.size).toBe(1);
  });
});
