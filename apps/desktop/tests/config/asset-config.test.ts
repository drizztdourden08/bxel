/* @layer renderer-app @kind test */
import { describe, expect, it, vi } from 'vitest';
import { ASSET_SOURCE } from '../../src/asset-config/asset-source.constants';
import { firstSprite, openedProject, revisionOf, undoOnce } from './config-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

describe('the value source over the open asset', () => {
  it('reads the fields of the sprite in focus', async () => {
    const { documentId } = await openedProject();
    const sprite = firstSprite(documentId);
    expect(ASSET_SOURCE.get('sprite.name')).toBe(sprite.name);
    expect([ASSET_SOURCE.get('sprite.width'), ASSET_SOURCE.get('sprite.height')]).toEqual([sprite.width, sprite.height]);
    expect(ASSET_SOURCE.get('sprite.frameMs')).toBe(sprite.frames[0]?.durationMs);
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

describe('the value source over pivot, frame time and platform', () => {
  it('moves the pivot in half pixels and sets every frame time', async () => {
    const { documentId } = await openedProject();
    await ASSET_SOURCE.set('sprite.pivotX', 2.5);
    await ASSET_SOURCE.set('sprite.frameMs', 250);
    await ASSET_SOURCE.flush();
    const sprite = firstSprite(documentId);
    expect(sprite.pivot.x2).toBe(5);
    expect(sprite.frames.every((frame) => frame.durationMs === 250)).toBe(true);
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
