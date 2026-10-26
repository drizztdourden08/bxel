/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { animatePlan } from '../../src/sheet-manager/animate-plan';
import { ANIMATE_START, CUT_STRIP_START, SLICE_START } from '../../src/sheet-manager/compose.constants';
import { cutStrip } from '../../src/sheet-manager/cut-strip';
import { makeAnimationFrom } from '../../src/sheet-manager/make-animation-from';
import { slicePlan } from '../../src/sheet-manager/slice-plan';
import { sliceSprites } from '../../src/sheet-manager/slice-sprites';
import { artwork, idOf, lastNotice, namesOf, openFile, patch, revision, spriteOf } from '../sheet/sheet-harness';
import { idsOf } from './manager-harness';

const targets = (...names: string[]) => artwork().sprites.filter((sprite) => names.includes(sprite.name));

beforeEach(() => openFile(['a', 'b', 'c'], 8));

describe('making an animation of sprites', () => {
  it('plans the size and the frames and says why an animation cannot be made', () => {
    const taken = ['walk'];
    expect(animatePlan(targets('a', 'b'), ANIMATE_START, taken)).toMatchObject({ width: 8, height: 8, frames: 2, mixed: false, name: 'a', blocker: null });
    expect(animatePlan([], ANIMATE_START, taken).blocker).toContain('at least one');
    expect(animatePlan(targets('a', 'sprite'), ANIMATE_START, taken)).toMatchObject({ width: 32, height: 32, mixed: true });
    expect(animatePlan(targets('a'), { ...ANIMATE_START, name: 'Walk' }, taken).blocker).toContain('already used');
  });

  it('makes one animation of the picked sprites in one undo step and keeps the sprites', async () => {
    const before = revision();
    expect(await makeAnimationFrom(idsOf('a', 'b'), 'both', { ...ANIMATE_START, durationMs: 80 })).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(namesOf()).toEqual(['sprite', 'a', 'b', 'c']);
    const [animation] = artwork().animations;
    expect([animation?.name, animation?.frames.map((frame) => frame.durationMs)]).toEqual(['both', [80, 80]]);
    expect(animation?.frames.map((frame) => frame.spriteId)).toEqual(idsOf('a', 'b'));
    stepHistory('undo');
    expect(artwork().animations).toHaveLength(0);
  });

  it('shows the reason and changes nothing when the name is taken', async () => {
    await makeAnimationFrom(idsOf('a'), 'one', ANIMATE_START);
    const before = revision();
    expect(await makeAnimationFrom(idsOf('b'), 'one', ANIMATE_START)).toBe(false);
    expect(revision()).toBe(before);
    expect(lastNotice()).toContain('already used');
  });
});

describe('cutting a strip into an animation', () => {
  const strip = { ...CUT_STRIP_START, strip: { ...CUT_STRIP_START.strip, columns: 2, rows: 2 } };

  it('uses the cells of the strip as clips without copying pixels', async () => {
    const before = revision();
    expect(await cutStrip(idOf('sprite'), 'cells', strip)).toBe(true);
    expect(revision()).toBe(before + 1);
    const [animation] = artwork().animations;
    expect(animation?.frames).toHaveLength(4);
    expect(animation?.frames.every((frame) => frame.clip !== null && frame.spriteId === idOf('sprite'))).toBe(true);
    expect(namesOf()).toEqual(['sprite', 'a', 'b', 'c']);
  });

  it('cuts the cells into sprites of their own when asked, in the same undo step', async () => {
    const before = revision();
    expect(await cutStrip(idOf('sprite'), 'cut', { ...strip, result: 'cut' })).toBe(true);
    expect(revision()).toBe(before + 1);
    const [animation] = artwork().animations;
    expect(animation?.frames.every((frame) => frame.clip === null)).toBe(true);
    expect(namesOf()).toHaveLength(4 + 4);
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
