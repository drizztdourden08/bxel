/* @layer renderer-app @kind test */
import type { BankId, DocumentId, Sprite } from '@bxel/document';
import { PALETTE_COMMAND_NAME } from '@bxel/palette';
import { describe, expect, it, vi } from 'vitest';
import { ASSET_SOURCE } from '../../src/asset-config/asset-source.constants';
import { changePreview } from '../../src/palette-change/change-preview';
import { runChange } from '../../src/palette-change/run-change';
import { startSwitch } from '../../src/palette-change/start-switch';
import { useChangeStore } from '../../src/stores/useChangeStore';
import { useDocumentStore } from '../../src/stores/useDocumentStore';
import { runSteps } from '../../src/transactions/run-steps';
import { liveArtwork, openedProject } from './config-harness';

vi.mock('@drizztdourden08/brock-react', async () => (await import('../project/project-mocks')).brockReactMock());

const firstSprite = (documentId: DocumentId): Sprite => {
  const sprite = liveArtwork(documentId).sprites[0];
  if (!sprite) throw new Error('no sprite');
  return sprite;
};

const undo = (documentId: DocumentId): void => {
  useDocumentStore.getState().host.undo(documentId);
};

const revision = (documentId: DocumentId): number => useDocumentStore.getState().host.view(documentId)?.state.revision ?? 0;

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
    const start = revision(documentId);
    await ASSET_SOURCE.set('sprite.name', 'h');
    await ASSET_SOURCE.set('sprite.name', 'hero_one');
    expect(ASSET_SOURCE.get('sprite.name')).toBe('hero_one');
    expect(revision(documentId)).toBe(start);
    await ASSET_SOURCE.flush();
    expect(firstSprite(documentId).name).toBe('hero_one');
    expect(revision(documentId)).toBe(start + 1);
    undo(documentId);
    expect(firstSprite(documentId).name).toBe(before);
  });

  it('resizes the sprite as one undo step', async () => {
    const { documentId } = await openedProject();
    const before = firstSprite(documentId);
    await ASSET_SOURCE.set('sprite.width', before.width + 4);
    await ASSET_SOURCE.flush();
    expect(firstSprite(documentId).width).toBe(before.width + 4);
    undo(documentId);
    expect(firstSprite(documentId).width).toBe(before.width);
  });

  it('moves the pivot in half pixels and sets every frame time', async () => {
    const { documentId } = await openedProject();
    await ASSET_SOURCE.set('sprite.pivotX', 2.5);
    await ASSET_SOURCE.set('sprite.frameMs', 250);
    await ASSET_SOURCE.flush();
    const sprite = firstSprite(documentId);
    expect(sprite.pivot.x2).toBe(5);
    expect(sprite.frames.every((frame) => frame.durationMs === 250)).toBe(true);
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

describe('changing the palette of a sprite', () => {
  const withSecondBank = async (): Promise<{ documentId: DocumentId; first: BankId; second: BankId }> => {
    const { documentId } = await openedProject();
    const host = useDocumentStore.getState().host;
    const first = firstSprite(documentId).bankId;
    const made = runSteps(host, documentId, 'Second palette', [
      { name: PALETTE_COMMAND_NAME.paletteCreate, targets: null, options: { name: 'Warm', cap: 16, transparent: true, colors: ['#ff0000', '#00ff00'] }, ref: 'warm' },
    ]);
    if (!made.ok) throw new Error(made.error.message);
    return { documentId, first, second: made.created['warm'] as BankId };
  };

  it('opens the remap dialog first and changes nothing until it is applied', async () => {
    const { documentId, first, second } = await withSecondBank();
    const start = revision(documentId);
    startSwitch(firstSprite(documentId).id, second);
    const request = useChangeStore.getState().request;
    expect(request).toMatchObject({ kind: 'switch', bankId: first, toBankId: second });
    expect(firstSprite(documentId).bankId).toBe(first);
    expect(revision(documentId)).toBe(start);
    const view = useDocumentStore.getState().host.view(documentId);
    const preview = request && view ? changePreview(view, request) : null;
    expect(preview?.error).toBeNull();
    expect(preview?.picture).not.toBeNull();
  });

  it('moves the sprite to the other palette as one undo step', async () => {
    const { documentId, first, second } = await withSecondBank();
    startSwitch(firstSprite(documentId).id, second);
    const request = useChangeStore.getState().request;
    if (!request) throw new Error('no request');
    const done = runChange(useDocumentStore.getState().host, request, 'commit');
    expect(done.ok).toBe(true);
    expect(firstSprite(documentId).bankId).toBe(second);
    undo(documentId);
    expect(firstSprite(documentId).bankId).toBe(first);
  });

  it('refuses the palette the sprite already uses', async () => {
    const { documentId, first } = await withSecondBank();
    startSwitch(firstSprite(documentId).id, first);
    const request = useChangeStore.getState().request;
    const view = useDocumentStore.getState().host.view(documentId);
    expect(request && view ? changePreview(view, request)?.error : null).toContain('already uses');
  });
});
