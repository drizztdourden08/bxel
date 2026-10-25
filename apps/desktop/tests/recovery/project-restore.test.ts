/* @layer renderer-app @kind test */
import type { DocumentId } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { artworkBytes } from '../../src/files/artwork-bytes';
import { openProject } from '../../src/project/open-project';
import type { RestoreKit } from '../../src/recovery/recovery.type';
import { restoreRecovered } from '../../src/recovery/restore-recovered';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useProjectStore } from '../../src/stores/useProjectStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { runSteps } from '../../src/transactions/run-steps';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { rig, ROOT } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { artworkOf, openSampleProject, workspaceOf } from '../workspace/open-sample-project';
import { paintSprite } from '../workspace/workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const PROJECT_FILE = `${ROOT}/Dungeon.bxproject`;

let held: Rig;

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
  const { documentId, paths } = await openSampleProject(held);
  const sprite = artworkOf(documentId).sprites[0];
  const bank = artworkOf(documentId).banks.find((each) => each.id === sprite?.bankId);
  if (!sprite || !bank) throw new Error('no sample');
  paintSprite(documentId, sprite.id);
  const swatches = bank.slots.slice(1, 3).map((slot) => slot.id);
  runSteps(useDocumentStore.getState().host, documentId, 'Ramp', [{ name: PALETTE_COMMAND_NAME.rampAdd, targets: null, options: { bankId: bank.id, name: 'glow', swatches } }]);
  const view = useDocumentStore.getState().host.view(documentId);
  if (!view) throw new Error('no view');
  const bytes = artworkBytes(view.state, () => 1_700_000_000_000);
  useDocumentStore.getState().host.close(documentId);
  useProjectStore.getState().close();
  held.disk.writes.length = 0;
  return { bytes, paths, sprite, bank };
};

beforeEach(() => {
  held = rig();
});

describe('restoring a recovered copy of a project', () => {
  it('restores into the project workspace with the asset paths and the unsaved assets, shared palettes included', async () => {
    const { bytes, paths, sprite, bank } = await crashed();
    const documentId: DocumentId = await restoreRecovered(kitOf(), { path: PROJECT_FILE, bytes });
    const workspace = workspaceOf(documentId);
    expect(workspace.kind).toBe('project');
    expect(workspace.paths).toEqual(paths);
    expect([...workspace.dirty]).toEqual(expect.arrayContaining([`palette:${bank.id}`, `sprite:${sprite.id}`]));
    expect([...workspace.dirty].some((key) => key.startsWith('sheet:'))).toBe(false);
    await saveWorkspace(held.kit, documentId);
    expect(held.disk.writes).toEqual(expect.arrayContaining([paths.get(sprite.id), paths.get(bank.id)]));
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
