/* @layer renderer-app @kind test */
import type { DocumentId } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { useWorkspaceStore } from '../../src/stores/useWorkspaceStore';
import { saveActiveAsset } from '../../src/workspace/save-active-asset';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { artworkOf, openSampleProject } from './open-sample-project';
import { paintSprite } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let held: Rig;

const host = () => useDocumentStore.getState().host;

const clean = (documentId: DocumentId): boolean => host().view(documentId)?.clean ?? false;

const paintedTwo = async () => {
  const { documentId } = await openSampleProject(held);
  const [first, second] = artworkOf(documentId).sprites;
  if (!first || !second) throw new Error('no sprites');
  paintSprite(documentId, first.id);
  paintSprite(documentId, second.id);
  return { documentId, first, second };
};

beforeEach(() => {
  held = rig();
});

describe('the saved point of a project', () => {
  it('keeps the undo history of every asset across Save all and follows the saved point', async () => {
    const { documentId } = await paintedTwo();
    await saveWorkspace(held.kit, documentId);
    expect(clean(documentId)).toBe(true);
    expect(host().view(documentId)?.canUndo).toBe(true);
    host().undo(documentId);
    expect(clean(documentId)).toBe(false);
    host().undo(documentId);
    expect(clean(documentId)).toBe(false);
    expect(host().view(documentId)?.canUndo).toBe(false);
    host().redo(documentId);
    expect(clean(documentId)).toBe(false);
    host().redo(documentId);
    expect(clean(documentId)).toBe(true);
  });

  it('stays unsaved when only one asset was saved, even back at the first history position', async () => {
    const { documentId, second } = await paintedTwo();
    useWorkspaceStore.getState().addTab({ id: `${documentId}|sprite:${second.id}`, documentId, key: { kind: 'sprite', id: second.id } });
    useWorkspaceStore.getState().setActiveTab(`${documentId}|sprite:${second.id}`);
    await saveActiveAsset(held.kit, false);
    expect(clean(documentId)).toBe(false);
    host().undo(documentId);
    host().undo(documentId);
    expect(host().view(documentId)?.canUndo).toBe(false);
    expect(useWorkspaceStore.getState().workspaces[documentId]?.dirty.has(`sprite:${second.id}`)).toBe(true);
    expect(clean(documentId)).toBe(false);
    host().redo(documentId);
    host().redo(documentId);
    expect(useWorkspaceStore.getState().workspaces[documentId]?.dirty.size).toBe(1);
    expect(clean(documentId)).toBe(false);
  });
});
