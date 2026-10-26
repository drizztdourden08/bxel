/* @layer renderer-app @kind test */
import { COMMAND_NAME } from '@bxel/document';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { runDocument } from '../../src/sheet/run-document';
import { spritesTarget } from '../../src/sheet/sprites-target';
import { SLICE_START, SPLIT_START } from '../../src/sheet-manager/compose.constants';
import { mergePlan } from '../../src/sheet-manager/merge-plan';
import { mergeSprites } from '../../src/sheet-manager/merge-sprites';
import { otherNames } from '../../src/sheet-manager/other-names';
import { slicePlan } from '../../src/sheet-manager/slice-plan';
import { sliceSprites } from '../../src/sheet-manager/slice-sprites';
import { splitPlan } from '../../src/sheet-manager/split-plan';
import { splitSprites } from '../../src/sheet-manager/split-sprites';
import { useSpriteStore } from '../../src/stores/useSpriteStore';
import { artwork, idOf, lastNotice, namesOf, openFile, patch, revision, spriteOf } from '../sheet/sheet-harness';
import { idsOf } from './manager-harness';

vi.mock('../../src/documents/document-host.constants', async () => (await import('../legacy/legacy-app-commands')).legacyAppCommands());

const targets = (...names: string[]) => artwork().sprites.filter((sprite) => names.includes(sprite.name));

const addFrame = (name: string): void => {
  runDocument('Add frame', [{ name: COMMAND_NAME.frameAdd, targets: spritesTarget([idOf(name)]), options: {} }]);
};

const chosen = (): string[] => useSpriteStore.getState().selected.map((id) => artwork().sprites.find((sprite) => sprite.id === id)?.name ?? '');

beforeEach(() => openFile(['a', 'b', 'c'], 8));

describe('merging sprites into one animation', () => {
  it('plans the size, the frames and says why a merge cannot run', () => {
    const plan = mergePlan(targets('a', 'b'));
    expect(plan).toMatchObject({ width: 8, height: 8, frames: 2, mixed: false, blocker: null });
    expect(mergePlan(targets('a')).blocker).toContain('at least two');
    expect(mergePlan(targets('a', 'sprite'))).toMatchObject({ width: 32, height: 32, mixed: true });
  });

  it('makes one sprite of the picked ones in one undo step and picks it', () => {
    patch('b', { x: 0, y: 0, width: 1, height: 1 }, 2);
    const before = revision();
    expect(mergeSprites(idsOf('a', 'b'), { name: '', anchor: 'center', keep: false })).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(namesOf()).toEqual(['sprite', 'a', 'c']);
    expect(spriteOf('a').frames).toHaveLength(2);
    expect(chosen()).toEqual(['a']);
    stepHistory('undo');
    expect(namesOf()).toEqual(['sprite', 'a', 'b', 'c']);
  });

  it('pads a smaller sprite by the anchor, takes a name and keeps the originals when asked', () => {
    expect(mergeSprites(idsOf('a', 'sprite'), { name: 'both', anchor: 'top-left', keep: true })).toBe(true);
    expect(namesOf()).toEqual(['sprite', 'both', 'a', 'b', 'c']);
    expect(spriteOf('both')).toMatchObject({ width: 32, height: 32 });
  });

  it('shows the reason and changes nothing when the name is taken', () => {
    const before = revision();
    expect(mergeSprites(idsOf('a', 'b'), { name: 'c', anchor: 'center', keep: false })).toBe(false);
    expect(revision()).toBe(before);
    expect(lastNotice()).toContain('already used');
  });
});

describe('splitting frames into sprites', () => {
  it('names a piece for each frame, skips sprites with one frame and says when nothing is left', () => {
    addFrame('a');
    const sources = targets('a').filter((sprite) => sprite.frames.length > 1);
    const plan = splitPlan(SPLIT_START, sources, otherNames(artwork(), sources, false));
    expect(plan).toEqual({ names: ['a_1', 'a_2'], error: null });
    expect(splitPlan(SPLIT_START, [], []).error).toContain('more than one frame');
    const clash = splitPlan({ ...SPLIT_START, pattern: 'b' }, sources, otherNames(artwork(), sources, false));
    expect(clash.error).toContain('already used');
  });

  it('turns every frame into a sprite in place of the sprite in one undo step', () => {
    addFrame('b');
    addFrame('b');
    const before = revision();
    expect(splitSprites(idsOf('b'), SPLIT_START)).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(namesOf()).toEqual(['sprite', 'a', 'b_1', 'b_2', 'b_3', 'c']);
    expect(chosen()).toEqual(['b_1', 'b_2', 'b_3']);
    stepHistory('undo');
    expect(namesOf()).toEqual(['sprite', 'a', 'b', 'c']);
  });
});

describe('slicing a sprite into a grid', () => {
  it('plans the grid, the names and the pixels left out, and reports a bad grid in words', () => {
    const [source] = targets('sprite');
    if (!source) throw new Error('no sprite');
    const plan = slicePlan({ ...SLICE_START, skipEmpty: false, columns: 2, rows: 2 }, [source], []);
    expect(plan.error).toBeNull();
    expect(plan.names).toEqual(['sprite_1', 'sprite_2', 'sprite_3', 'sprite_4']);
    expect(plan.grid).toMatchObject({ cellWidth: 16, cellHeight: 16 });
    const edge = slicePlan({ ...SLICE_START, by: 'size', cellWidth: 12, cellHeight: 16, skipEmpty: false }, [source], []);
    expect(edge.leftOut).toBe(32 * 32 - 2 * 12 * 2 * 16);
    expect(slicePlan({ ...SLICE_START, columns: 3 }, [source], []).error).toContain('does not divide');
  });

  it('skips cells with no pixel and cuts the rest in one undo step', () => {
    patch('sprite', { x: 0, y: 0, width: 4, height: 4 }, 1);
    const before = revision();
    expect(sliceSprites(idsOf('sprite'), { ...SLICE_START, columns: 2, rows: 2 })).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(namesOf()).toEqual(['sprite_1', 'a', 'b', 'c']);
    expect(spriteOf('sprite_1')).toMatchObject({ width: 16, height: 16 });
    stepHistory('undo');
    expect(namesOf()).toEqual(['sprite', 'a', 'b', 'c']);
  });
});
