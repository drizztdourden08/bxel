/* @layer renderer-app @kind test */
import type { DocumentId } from '@bxel/document';
import { describe, expect, it, vi } from 'vitest';
import { artworkBytes } from '../../src/files/artwork-bytes';
import { openProject } from '../../src/project/open-project';
import type { RestoreKit } from '../../src/recovery/recovery.type';
import { restoreRecovered } from '../../src/recovery/restore-recovered';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { ROOT } from '../project/project-harness';
import { heldRig } from '../workspace/held-rig';
import { openSampleProject, spriteAndBank, workspaceOf } from '../workspace/open-sample-project';
import { addRamp, paintSprite } from '../workspace/workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const PROJECT_FILE = `${ROOT}/Dungeon.bxproject`;

const held = heldRig();

const kitOf = (): RestoreKit => ({
  host: useDocumentStore.getState().host,
  remember: () => undefined,
  markRecovered: () => undefined,
  flush: () => Promise.resolve(),
  project: async () => {
    await openProject(ROOT, true);
    return Object.values(useWorkspaceStore.getState().workspaces).find((each) => each.kind === 'project') ?? null;
  },
});

const crashed = async () => {
  const { documentId, paths } = await openSampleProject(held.rig);
  const { sprite, bank } = spriteAndBank(documentId);
  paintSprite(documentId, sprite.id);
  addRamp(documentId, bank, 'glow');
  const view = useDocumentStore.getState().host.view(documentId);
  if (!view) throw new Error('no view');
  const bytes = artworkBytes(view.state, () => 1_700_000_000_000);
  useDocumentStore.getState().host.close(documentId);
  useProjectStore.getState().close();
  held.rig.disk.writes.length = 0;
  return { bytes, paths, sprite, bank };
};

describe('restoring a recovered copy of a project', () => {
  it('restores into the project workspace with the asset paths and the unsaved assets, shared palettes included', async () => {
    const { bytes, paths, sprite, bank } = await crashed();
    const documentId: DocumentId = await restoreRecovered(kitOf(), { path: PROJECT_FILE, bytes });
    const workspace = workspaceOf(documentId);
    expect(workspace.kind).toBe('project');
    expect(workspace.paths).toEqual(paths);
    expect([...workspace.dirty]).toEqual(expect.arrayContaining([`palette:${bank.id}`, `sprite:${sprite.id}`]));
    expect([...workspace.dirty].some((key) => key.startsWith('sheet:'))).toBe(false);
    await saveWorkspace(held.rig.kit, documentId);
    expect(held.rig.disk.writes).toEqual(expect.arrayContaining([paths.get(sprite.id), paths.get(bank.id)]));
  });
});

describe('restoring a recovered project copy over unsaved work', () => {
  it('refuses and keeps the open project as it is', async () => {
    const { bytes, sprite } = await crashed();
    await openProject(ROOT, true);
    const open = Object.values(useWorkspaceStore.getState().workspaces)[0];
    if (!open) throw new Error('no workspace');
    paintSprite(open.documentId, sprite.id, 3);
    await expect(restoreRecovered(kitOf(), { path: PROJECT_FILE, bytes })).rejects.toThrow('unsaved changes');
    expect(workspaceOf(open.documentId).dirty.has(`sprite:${sprite.id}`)).toBe(true);
  });
});
