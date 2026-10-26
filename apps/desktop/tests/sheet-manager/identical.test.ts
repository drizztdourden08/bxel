/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runDocument } from '../../src/sheet/run-document';
import { spriteImage } from '../../src/sheet/sprite-image';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { allFacts } from '../../src/sheet-manager/all-facts';
import { compareSprites } from '../../src/sheet-manager/compare-sprites';
import { diffImage } from '../../src/sheet-manager/diff-image';
import { findIdentical } from '../../src/sheet-manager/find-identical';
import { NO_FILTER } from '../../src/sheet-manager/manager.constants';
import { managerSheet } from '../../src/sheet-manager/manager-sheet';
import { selectDuplicates } from '../../src/sheet-manager/select-duplicates';
import { twinIds } from '../../src/sheet-manager/twin-ids';
import { visibleFacts } from '../../src/sheet-manager/visible-facts';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { artwork, idOf, lastNotice, openFile, patch, spriteOf } from '../sheet/sheet-harness';

vi.mock('../../src/documents/document-host.constants', async () => (await import('../legacy/legacy-app-commands')).legacyAppCommands());

const dot = (x: number, y: number) => ({ x, y, width: 1, height: 1 });

const named = (ids: readonly string[][]): string[][] =>
  ids.map((group) => group.map((id) => artwork().sprites.find((sprite) => sprite.id === id)?.name ?? id));

const chosen = (): string[] => useSpriteStore.getState().selected.map((id) => artwork().sprites.find((sprite) => sprite.id === id)?.name ?? '');

beforeEach(() => {
  openFile(['a', 'b', 'c', 'f', 'e'], 8);
  patch('a', dot(0, 0), 1);
  patch('b', dot(0, 0), 1);
  patch('f', dot(7, 0), 1);
  patch('c', dot(1, 1), 1);
});

describe('finding identical sprites', () => {
  it('groups sprites with the same pixels, size and palette', () => {
    expect(named(findIdentical(artwork().sprites, false))).toEqual([['a', 'b']]);
  });

  it('counts a flipped sprite as identical only when asked', () => {
    expect(named(findIdentical(artwork().sprites, true))).toEqual([['a', 'b', 'f']]);
  });

  it('tells apart sprites that differ in frames or in the look of a frame', () => {
    runDocument('Add frame', [{ name: COMMAND_NAME.frameAdd, targets: spritesTarget([idOf('b')]), options: {} }]);
    expect(findIdentical(artwork().sprites, false)).toEqual([]);
  });

  it('puts blank sprites of one size together', () => {
    openFile(['x', 'y', 'z'], 8);
    expect(named(findIdentical(artwork().sprites, false))).toEqual([['x', 'y', 'z']]);
  });
});

describe('selecting duplicates', () => {
  it('picks all but the first of each group', () => {
    expect(selectDuplicates(artwork().sprites, false)).toBe(true);
    expect(chosen()).toEqual(['b']);
    expect(selectDuplicates(artwork().sprites, true)).toBe(true);
    expect(chosen()).toEqual(['b', 'f']);
  });

  it('says so when no sprite repeats', () => {
    patch('b', dot(3, 3), 1);
    expect(selectDuplicates(artwork().sprites, false)).toBe(false);
    expect(lastNotice()).toContain('No identical');
  });

  it('lets the filter show only the sprites that have a twin', () => {
    const art = artwork();
    const facts = allFacts(art, managerSheet(art, null, null));
    const list = (identical: 'off' | 'same' | 'flips') =>
      visibleFacts(facts, { query: '', filter: { ...NO_FILTER, identical }, sortKey: 'manual', sortDown: false, twins: twinIds(facts, identical) }).map(
        (fact) => fact.sprite.name,
      );
    expect(list('off')).toHaveLength(6);
    expect(list('same')).toEqual(['a', 'b']);
    expect(list('flips')).toEqual(['a', 'b', 'f']);
  });
});

describe('comparing two sprites', () => {
  it('says identical, flipped, different and different in size', () => {
    const art = artwork();
    expect(compareSprites(art, spriteOf('a'), spriteOf('b'))).toMatchObject({ identical: true, flippedAs: null, differing: 0 });
    expect(compareSprites(art, spriteOf('a'), spriteOf('f'))).toMatchObject({ identical: false, flippedAs: 'horizontal', differing: 2 });
    expect(compareSprites(art, spriteOf('a'), spriteOf('c'))).toMatchObject({ identical: false, flippedAs: null, differing: 2, total: 64 });
    expect(compareSprites(art, spriteOf('a'), spriteOf('sprite'))).toMatchObject({ sameSize: false, differing: null });
  });

  it('marks the pixels that differ in red and fades the rest', () => {
    const art = artwork();
    const a = spriteImage(art, spriteOf('a'));
    const c = spriteImage(art, spriteOf('c'));
    if (!a || !c) throw new Error('no image');
    const diff = diffImage(a, c);
    expect(Array.from(diff.rgba.subarray(0, 4))).toEqual([255, 0, 0, 255]);
    const end = diff.rgba.length - 4;
    expect(diff.rgba[end + 3]).toBe(0);
  });
});
