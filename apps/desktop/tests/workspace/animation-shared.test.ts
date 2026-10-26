/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import type { Artwork } from '@bxel/document';
import { describe, expect, it, vi } from 'vitest';
import { sheetPreviewImage } from '../../src/asset-overview/sheet-preview-image';
import { createDefaultArtwork } from '../../src/documents/create-default-artwork';
import { commitRequest } from '../../src/editor/commit-request';
import { currentTarget } from '../../src/editor/current-target';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { goToFrame } from '../../src/timeline/go-to-frame';
import { runSteps } from '../../src/transactions/run-steps';
import { focusTab } from '../../src/workspace/focus-tab';
import { tabOf } from '../../src/workspace/tab-of';
import { heldRig } from './held-rig';
import { artworkOf, openSampleProject, workspaceOf } from './open-sample-project';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const held = heldRig();

const sharedArtwork = (): Artwork => {
  const { host } = useDocumentStore.getState();
  const documentId = createDefaultArtwork(host);
  const made = runSteps(host, documentId, 'Make', [
    { name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'tree', width: 8, height: 8 }, ref: 'tree' },
    { name: COMMAND_NAME.spriteCreate, targets: null, options: { name: 'gem', width: 8, height: 8 }, ref: 'gem' },
    { name: COMMAND_NAME.sheetCreate, targets: null, options: { name: 'world' }, ref: 'world' },
    { name: COMMAND_NAME.sheetAdd, targets: spritesTarget([{ ref: 'tree' }] as never), options: { sheet: { ref: 'world' } } },
    { name: COMMAND_NAME.animationCreate, targets: null, options: { name: 'blink', source: { kind: 'sprites', sprites: [{ ref: 'tree' }, { ref: 'gem' }], mode: 'reference' } } },
  ]);
  if (!made.ok) throw new Error(made.error.message);
  const artwork = host.view(documentId)?.state.artwork;
  host.close(documentId);
  if (!artwork) throw new Error('no artwork');
  return artwork;
};

describe('drawing on a sprite an animation shares with a sheet', () => {
  it('redraws the sheet and dirties only the sprite', async () => {
    const { documentId } = await openSampleProject(held.rig, sharedArtwork());
    const loaded = artworkOf(documentId);
    const tree = loaded.sprites.find((sprite) => sprite.name === 'tree');
    const blink = loaded.animations[0];
    const sheet = loaded.sheets[0];
    if (!tree || !blink || !sheet) throw new Error('the project is missing assets');
    expect(workspaceOf(documentId).dirty.size).toBe(0);
    const before = sheetPreviewImage(loaded, sheet.id);
    focusTab(tabOf(documentId, { kind: 'animation', id: blink.id }));
    goToFrame(blink.frames[0]?.id as never);
    const target = currentTarget();
    expect(target?.sprite.id).toBe(tree.id);
    if (!target) throw new Error('no target');
    const options = { points: [{ x: 2, y: 2 }], brush: { shape: 'square', size: 1 }, index: 2 };
    const scope = { sprites: [target.sprite.id], layers: { by: 'ids', ids: [target.layerId] }, frames: { by: 'ids', ids: [target.frameId] } } as const;
    const done = useDocumentStore.getState().host.execute(commitRequest(target, 'Paint', { name: COMMAND_NAME.pixelsPaint, options }, scope));
    expect(done.ok).toBe(true);
    expect([...workspaceOf(documentId).dirty]).toEqual([`sprite:${tree.id}`]);
    const after = sheetPreviewImage(artworkOf(documentId), sheet.id);
    expect(before.kind === 'image' && after.kind === 'image' && before.image.data.join() !== after.image.data.join()).toBe(true);
  });
});
