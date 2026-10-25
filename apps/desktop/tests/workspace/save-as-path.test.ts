/* @layer renderer-app @kind test */
import type { DocumentId, SpriteId } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { saveActiveAsset } from '../../src/workspace/save-active-asset';
import { tabOf } from '../../src/workspace/tab-of';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { confirmAction } from '../project/project-mocks';
import { artworkOf, openSampleProject, workspaceOf } from './open-sample-project';
import { paintSprite } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let held: Rig;

const pickReturns = (path: string): void => {
  vi.spyOn(held.disk.port, 'saveAs').mockImplementation(() => Promise.resolve({ path, folderGranted: false }) as never);
};

const showing = (documentId: DocumentId, id: SpriteId): void => {
  const tab = tabOf(documentId, { kind: 'sprite', id });
  useWorkspaceStore.getState().addTab(tab);
  useWorkspaceStore.getState().setActiveTab(tab.id);
};

const twoSprites = async () => {
  const { documentId, paths } = await openSampleProject(held);
  const [first, second] = artworkOf(documentId).sprites;
  if (!first || !second) throw new Error('no sprites');
  paintSprite(documentId, first.id);
  showing(documentId, first.id);
  return { documentId, paths, first, second };
};

beforeEach(() => {
  held = rig();
});

describe('Save As onto a path', () => {
  it('refuses a file that another open asset owns and writes nothing', async () => {
    const { documentId, paths, first, second } = await twoSprites();
    const taken = paths.get(second.id) ?? '';
    const before = held.disk.files.get(taken);
    pickReturns(taken);
    const outcome = await saveActiveAsset(held.kit, true);
    expect(outcome.kind).toBe('cancelled');
    expect(held.disk.writes).toEqual([]);
    expect(held.disk.files.get(taken)).toBe(before);
    expect(workspaceOf(documentId).paths.get(first.id)).toBe(paths.get(first.id));
  });

  it('asks before replacing a file when the picked ending changes to the asset kind', async () => {
    const { paths, first } = await twoSprites();
    const stray = (paths.get(first.id) ?? '').replace(/[^/]+$/, 'stray.bxsprite');
    held.disk.files.set(stray, new Uint8Array([1, 2, 3]));
    pickReturns(stray.replace('.bxsprite', '.bxsheet'));
    confirmAction.mockImplementation(() => Promise.resolve(false));
    const outcome = await saveActiveAsset(held.kit, true);
    expect(confirmAction).toHaveBeenCalledWith(expect.objectContaining({ title: 'Replace the file?' }));
    expect(outcome.kind).toBe('cancelled');
    expect(held.disk.files.get(stray)).toEqual(new Uint8Array([1, 2, 3]));
  });
});
