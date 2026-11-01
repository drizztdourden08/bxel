/* @layer renderer-app @kind test */
import { findBank, findSprite, MAX_SPRITE_SIZE } from '@bxel/document';
import type { SpriteId } from '@bxel/document';
import { beforeEach, describe, expect, it } from 'vitest';
import { STRIP_START } from '../../src/add-frames/add-frames.constants';
import { dropImageFiles } from '../../src/add-frames/drop-image-files';
import { fitImage } from '../../src/add-frames/fit-image';
import { DROP_TEXT } from '../../src/add-frames/image-drop.constants';
import { planImageDrop } from '../../src/add-frames/plan-image-drop';
import { runAddFrames } from '../../src/add-frames/run-add-frames';
import { useAddFramesStore } from '../../src/stores/useAddFramesStore';
import { CLEAR, imageFile, INDIGO, NIGHT, OFF_PALETTE } from './image-file';
import { animationOf, freshAnimation, live, revision, SIDE, withFrames } from './timeline-harness';

beforeEach(() => {
  freshAnimation();
  useAddFramesStore.getState().hide();
});

const FRAME = { width: SIDE, height: SIDE };

const leftHalf = (x: number): typeof NIGHT => (x < SIDE / 2 ? NIGHT : CLEAR);

const celPixels = (frameIndex: number): number[] => {
  const sprite = findSprite(live().artwork, animationOf().frames[frameIndex]?.spriteId as SpriteId);
  return Array.from(Object.values(sprite?.cels ?? {})[0]?.pixels ?? []);
};

describe('K1 what a dropped image becomes', { tags: ['critical'] }, () => {
  it('is a frame when it is the size of the animation', () => {
    expect(planImageDrop({ width: 8, height: 8 }, FRAME)).toEqual({ kind: 'frame' });
  });

  it('is a strip when it is a whole number of frames wide and one frame high', () => {
    expect(planImageDrop({ width: 24, height: 8 }, FRAME)).toEqual({ kind: 'strip', cells: 3 });
  });

  it('is refused with the sizes when the height or the width does not fit', () => {
    const tall = planImageDrop({ width: 16, height: 16 }, FRAME);
    expect(tall).toMatchObject({ kind: 'refuse' });
    expect(tall.kind === 'refuse' ? tall.reason : '').toBe(DROP_TEXT.size(16, 16, 8, 8));
    expect(planImageDrop({ width: 20, height: 8 }, FRAME).kind).toBe('refuse');
    expect(planImageDrop({ width: 4, height: 8 }, FRAME).kind).toBe('refuse');
  });

  it('is refused when a strip is wider than the largest image', () => {
    const wide = planImageDrop({ width: MAX_SPRITE_SIZE + SIDE, height: 8 }, FRAME);
    expect(wide).toEqual({ kind: 'refuse', reason: DROP_TEXT.tooLarge(MAX_SPRITE_SIZE + SIDE, 8) });
  });
});

describe('K1 mapping a dropped image to the palette', { tags: ['critical'] }, () => {
  const source = (colour: typeof NIGHT, count = SIDE * SIDE) => {
    const data = new Uint8ClampedArray(count * 4);
    for (let at = 0; at < count; at += 1) data.set(colour, at * 4);
    return { fileName: 'x.png', width: SIDE, height: SIDE, data };
  };
  const bank = () => findBank(live().artwork, live().animation.bankId);

  it('keeps an image whose colours are all in the palette, with the transparent slot at zero', () => {
    withFrames(1);
    const fit = fitImage(source(NIGHT), bank());
    expect(fit.ok).toBe(true);
    expect(fit.ok ? Array.from(fit.pixels.slice(0, 3)) : []).toEqual([1, 1, 1]);
    const clear = fitImage(source(CLEAR), bank());
    expect(clear.ok ? clear.pixels.every((value) => value === 0) : false).toBe(true);
  });

  it('refuses an image with a colour outside the palette and counts the pixels', () => {
    withFrames(1);
    const fit = fitImage(source(OFF_PALETTE), bank());
    expect(fit).toEqual({ ok: false, reason: DROP_TEXT.colours(SIDE * SIDE) });
  });

  it('refuses when the palette cannot be found', () => {
    expect(fitImage(source(NIGHT), undefined)).toEqual({ ok: false, reason: DROP_TEXT.noBank });
  });
});

describe('S2 dropping image files on the frame track', { tags: ['standard'] }, () => {
  it('adds an owned frame at the drop position with the pixels mapped to the palette', async () => {
    withFrames(2);
    const reasons = await dropImageFiles([imageFile('left.png', SIDE, SIDE, (x) => leftHalf(x))], 1);
    expect(reasons).toEqual([]);
    expect(animationOf().frames).toHaveLength(3);
    const sprite = findSprite(live().artwork, animationOf().frames[1]?.spriteId as SpriteId);
    expect(sprite?.role).toBe('frame');
    expect(celPixels(1)).toEqual(Array.from({ length: SIDE * SIDE }, (_, at) => (at % SIDE < SIDE / 2 ? 1 : 0)));
  });

  it('adds several files in order as one undo step', async () => {
    withFrames(1);
    const before = revision();
    const files = [imageFile('a.png', SIDE, SIDE, () => NIGHT), imageFile('b.png', SIDE, SIDE, () => INDIGO)];
    expect(await dropImageFiles(files, 0)).toEqual([]);
    expect(revision()).toBe(before + 1);
    expect(celPixels(0)[0]).toBe(1);
    expect(celPixels(1)[0]).toBe(2);
    expect(animationOf().frames).toHaveLength(3);
  });

  it('refuses a file of another size and changes nothing', async () => {
    withFrames(1);
    const before = revision();
    const reasons = await dropImageFiles([imageFile('big.png', 16, 16, () => NIGHT)], 1);
    expect(reasons).toEqual([DROP_TEXT.refused('big.png', DROP_TEXT.size(16, 16, 8, 8))]);
    expect(revision()).toBe(before);
  });

  it('refuses a file with colours outside the palette, and a file that is not an image', async () => {
    withFrames(1);
    const reasons = await dropImageFiles([imageFile('odd.png', SIDE, SIDE, () => OFF_PALETTE), new File(['hi'], 'notes.txt', { type: 'text/plain' })], 1);
    expect(reasons).toEqual([DROP_TEXT.refused('odd.png', DROP_TEXT.colours(SIDE * SIDE)), DROP_TEXT.notImage('notes.txt')]);
    expect(animationOf().frames).toHaveLength(1);
  });

  it('still adds the good files when another file is refused', async () => {
    withFrames(1);
    const reasons = await dropImageFiles([imageFile('ok.png', SIDE, SIDE, () => NIGHT), imageFile('bad.png', 3, 3, () => NIGHT)], 1);
    expect(reasons).toHaveLength(1);
    expect(animationOf().frames).toHaveLength(2);
  });

  it('opens the strip dialog at the drop position for a strip image', async () => {
    withFrames(2);
    const before = revision();
    expect(await dropImageFiles([imageFile('walk.png', SIDE * 3, SIDE, () => NIGHT)], 1)).toEqual([]);
    const state = useAddFramesStore.getState();
    expect(state.mode).toBe('strip');
    expect(state.file).toMatchObject({ name: 'walk.png', width: SIDE * 3, height: SIDE, at: 1 });
    expect(revision()).toBe(before);
  });

  it('asks for a strip to be dropped on its own', async () => {
    withFrames(1);
    const reasons = await dropImageFiles([imageFile('walk.png', SIDE * 3, SIDE, () => NIGHT), imageFile('one.png', SIDE, SIDE, () => NIGHT)], 1);
    expect(reasons).toEqual([DROP_TEXT.stripAlone('walk.png')]);
    expect(useAddFramesStore.getState().mode).toBeNull();
    expect(animationOf().frames).toHaveLength(2);
  });
});

describe('S2 adding the frames of a strip image', { tags: ['standard'] }, () => {
  it('imports the strip as a sprite and adds one clipped frame per cell in one undo step', async () => {
    withFrames(1);
    await dropImageFiles([imageFile('walk.png', SIDE * 3, SIDE, () => NIGHT)], 1);
    const file = useAddFramesStore.getState().file;
    if (!file) throw new Error('the strip dialog did not open');
    const before = revision();
    const spec = { ...STRIP_START, by: 'size' as const, cellWidth: SIDE, cellHeight: SIDE };
    expect(runAddFrames({ kind: 'file', file, spec, cells: 3, result: 'cells', durationMs: 80, at: file.at })).toBe(true);
    expect(revision()).toBe(before + 1);
    const added = animationOf().frames.slice(1);
    expect(added).toHaveLength(3);
    expect(new Set(added.map((frame) => frame.spriteId)).size).toBe(1);
    expect(added.map((frame) => frame.durationMs)).toEqual([80, 80, 80]);
    expect(added.map((frame) => frame.clip?.x)).toEqual([0, SIDE, SIDE * 2]);
  });
});
