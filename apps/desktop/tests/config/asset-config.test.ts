/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { ASSET_SOURCE } from '../../src/asset-config/asset-source.constants';
import { COMMAND_NAME } from '@bxel/document';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';
import { focusTab } from '../../src/workspace/focus-tab';
import { tabOf } from '../../src/workspace/tab-of';
import { firstSprite, liveArtwork, openedProject, revisionOf, undoOnce } from './config-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

describe('the value source over the open asset', () => {
  it('reads the fields of the sprite in focus', async () => {
    const { documentId } = await openedProject();
    const sprite = firstSprite(documentId);
    expect(ASSET_SOURCE.get('sprite.name')).toBe(sprite.name);
    expect([ASSET_SOURCE.get('sprite.width'), ASSET_SOURCE.get('sprite.height')]).toEqual([sprite.width, sprite.height]);
  });

  it('renames the sprite once after typing stops, and one undo puts the name back', async () => {
    const { documentId } = await openedProject();
    const before = firstSprite(documentId).name;
    const start = revisionOf(documentId);
    await ASSET_SOURCE.set('sprite.name', 'h');
    await ASSET_SOURCE.set('sprite.name', 'hero_one');
    expect(ASSET_SOURCE.get('sprite.name')).toBe('hero_one');
    expect(revisionOf(documentId)).toBe(start);
    await ASSET_SOURCE.flush();
    expect(firstSprite(documentId).name).toBe('hero_one');
    expect(revisionOf(documentId)).toBe(start + 1);
    undoOnce(documentId);
    expect(firstSprite(documentId).name).toBe(before);
  });

  it('resizes the sprite as one undo step', async () => {
    const { documentId } = await openedProject();
    const before = firstSprite(documentId);
    await ASSET_SOURCE.set('sprite.width', before.width + 4);
    await ASSET_SOURCE.flush();
    expect(firstSprite(documentId).width).toBe(before.width + 4);
    undoOnce(documentId);
    expect(firstSprite(documentId).width).toBe(before.width);
  });

});

describe('the value source over pivot, grid and platform', () => {
  it('moves the pivot in half pixels', async () => {
    const { documentId } = await openedProject();
    await ASSET_SOURCE.set('sprite.pivotX', 2.5);
    await ASSET_SOURCE.flush();
    const sprite = firstSprite(documentId);
    expect(sprite.pivot.x2).toBe(5);
  });

  it('stores a pixel grid on the sprite, keeps one cell when the other changes, and clears it at 1 by 1', async () => {
    const { documentId } = await openedProject();
    expect([ASSET_SOURCE.get('sprite.gridWidth'), ASSET_SOURCE.get('sprite.gridHeight')]).toEqual([1, 1]);
    await ASSET_SOURCE.set('sprite.gridWidth', 8);
    await ASSET_SOURCE.flush();
    expect(firstSprite(documentId).pixelGrid).toEqual({ width: 8, height: 1 });
    await ASSET_SOURCE.set('sprite.gridHeight', 4);
    await ASSET_SOURCE.flush();
    expect(firstSprite(documentId).pixelGrid).toEqual({ width: 8, height: 4 });
    undoOnce(documentId);
    expect(firstSprite(documentId).pixelGrid).toEqual({ width: 8, height: 1 });
    await ASSET_SOURCE.set('sprite.gridWidth', 1);
    await ASSET_SOURCE.flush();
    expect(firstSprite(documentId).pixelGrid).toBeUndefined();
  });

  it('ignores a half typed number', async () => {
    const { documentId } = await openedProject();
    const before = firstSprite(documentId).width;
    await ASSET_SOURCE.set('sprite.width', Number.NaN);
    await ASSET_SOURCE.flush();
    expect(firstSprite(documentId).width).toBe(before);
    expect(ASSET_SOURCE.get('sprite.width')).toBe(before);
  });

  it('gives the sprite a platform of its own and takes it away again', async () => {
    const { documentId } = await openedProject();
    await ASSET_SOURCE.set('sprite.platform', 'nes');
    await ASSET_SOURCE.set('sprite.strict', true);
    expect(firstSprite(documentId)).toMatchObject({ platformId: 'nes', platformStrict: true });
    await ASSET_SOURCE.set('sprite.platform', '');
    const sprite = firstSprite(documentId);
    expect(sprite.platformId).toBeUndefined();
    expect(sprite.platformStrict).toBeUndefined();
  });

  it('notifies a subscriber when the asset changes', async () => {
    const { documentId } = await openedProject();
    const listener = vi.fn();
    const stop = ASSET_SOURCE.subscribe?.(listener);
    await ASSET_SOURCE.set('sprite.pivotY', 1);
    await ASSET_SOURCE.flush();
    stop?.();
    expect(listener).toHaveBeenCalled();
    expect(firstSprite(documentId).pivot.y2).toBe(2);
  });
});

describe('the value source over an animation', () => {
  it('reads and changes the canvas, the anchor and the loop of the animation in focus', async () => {
    const { documentId } = await openedProject();
    const made = runSteps(useDocumentStore.getState().host, documentId, 'Animation', [
      { name: COMMAND_NAME.animationCreate, targets: null, options: { name: 'walk', source: { kind: 'blank', width: 8, height: 8, frames: 1 } }, ref: 'anim' },
    ]);
    if (!made.ok) throw new Error(made.error.message);
    focusTab(tabOf(documentId, { kind: 'animation', id: made.created['anim'] ?? '' }));
    expect([ASSET_SOURCE.get('animation.name'), ASSET_SOURCE.get('animation.width'), ASSET_SOURCE.get('animation.anchorX')]).toEqual(['walk', 8, 4]);
    await ASSET_SOURCE.set('animation.width', 12);
    await ASSET_SOURCE.set('animation.anchorX', 2.5);
    await ASSET_SOURCE.set('animation.loopDirection', 'pingpong');
    await ASSET_SOURCE.flush();
    const animation = liveArtwork(documentId).animations[0];
    expect(animation).toMatchObject({ width: 12, anchor: { x2: 5, y2: 8 }, loop: { direction: 'pingpong' } });
  });
});
