/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { DocumentId, SpriteId } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';
import { saveWorkspace } from '../../src/workspace/save-workspace';
import { rig } from '../project/project-harness';
import type { Rig } from '../project/project-harness';
import { artworkOf, openSampleProject, workspaceOf } from './open-sample-project';
import { paintSprite } from './workspace-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

let held: Rig;

const deleteSprite = (documentId: DocumentId, id: SpriteId): void => {
  const removed = runSteps(useDocumentStore.getState().host, documentId, 'Remove', [
    ...artworkOf(documentId).sheets.map((sheet) => ({ name: COMMAND_NAME.sheetRemove, targets: spritesTarget([id]), options: { sheet: sheet.id } })),
    { name: COMMAND_NAME.spriteDelete, targets: spritesTarget([id]), options: {} },
  ]);
  if (!removed.ok) throw new Error(removed.error.message);
};

beforeEach(() => {
  held = rig();
});

describe('undo after a deleted asset went to the trash at Save all', () => {
  it('keeps the restored asset unsaved until it is written again, even back at its loaded content', async () => {
    const { documentId, paths } = await openSampleProject(held);
    const lone = artworkOf(documentId).sprites[1];
    if (!lone) throw new Error('no sprite');
    deleteSprite(documentId, lone.id);
    await saveWorkspace(held.kit, documentId);
    expect(held.disk.files.has(paths.get(lone.id) ?? '')).toBe(false);
    const { host } = useDocumentStore.getState();
    host.undo(documentId);
    paintSprite(documentId, lone.id);
    host.undo(documentId);
    expect(workspaceOf(documentId).dirty.has(`sprite:${lone.id}`)).toBe(true);
    await saveWorkspace(held.kit, documentId);
    expect(held.disk.files.has(paths.get(lone.id) ?? '')).toBe(true);
  });
});
