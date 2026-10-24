/* @layer renderer-app @kind test */
import { beforeEach, describe, expect, it } from 'vitest';
import { stepHistory } from '../../src/editor/step-history';
import { flipSprites } from '../../src/sheet-manager/flip-sprites';
import { resizeClips } from '../../src/sheet-manager/resize-clips';
import { resizeSprites } from '../../src/sheet-manager/resize-sprites';
import { trimSprites } from '../../src/sheet-manager/trim-sprites';
import { turnSprites } from '../../src/sheet-manager/turn-sprites';
import { lastNotice, openFile, patch, pixelsOf, revision, spriteOf } from '../sheet/sheet-harness';
import { idsOf } from './manager-harness';

beforeEach(() => {
  openFile(['a', 'b'], 4);
  patch('a', { x: 1, y: 1, width: 2, height: 1 }, 1);
  patch('b', { x: 0, y: 0, width: 1, height: 1 }, 2);
});

describe('flipping and turning many sprites', () => {
  it('flips both sprites in one undo step', () => {
    const before = revision();
    expect(flipSprites(idsOf('a', 'b'), 'horizontal')).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(pixelsOf('b')[3]).toBe(2);
    expect(pixelsOf('b')[0]).toBe(0);
    stepHistory('undo');
    expect(pixelsOf('b')[0]).toBe(2);
  });

  it('turns a sprite and swaps its sides', () => {
    resizeSprites(idsOf('a'), { width: 6, height: 2, anchor: 'top-left' });
    expect(turnSprites(idsOf('a'), 'clockwise')).toBe(true);
    expect(spriteOf('a')).toMatchObject({ width: 2, height: 6 });
  });
});

describe('the canvas size of many sprites', () => {
  it('counts the pixels a smaller canvas would cut off', () => {
    const sprites = [spriteOf('a'), spriteOf('b')];
    expect(resizeClips(sprites, { width: 4, height: 4, anchor: 'center' })).toBe(0);
    expect(resizeClips(sprites, { width: 1, height: 1, anchor: 'top-left' })).toBe(2);
    expect(resizeClips(sprites, { width: 2, height: 2, anchor: 'bottom-right' })).toBe(3);
  });

  it('resizes with an anchor in one undo step', () => {
    const before = revision();
    expect(resizeSprites(idsOf('a', 'b'), { width: 6, height: 6, anchor: 'center' })).toBe(true);
    expect(revision()).toBe(before + 1);
    expect(spriteOf('a')).toMatchObject({ width: 6, height: 6 });
    expect(spriteOf('b')).toMatchObject({ width: 6, height: 6 });
    expect(pixelsOf('b')[1 * 6 + 1]).toBe(2);
    stepHistory('undo');
    expect(spriteOf('a')).toMatchObject({ width: 4, height: 4 });
  });

  it('refuses a size that is too large and says why', () => {
    expect(resizeSprites(idsOf('a'), { width: 5000, height: 4, anchor: 'center' })).toBe(false);
    expect(lastNotice()).not.toBeNull();
    expect(spriteOf('a')).toMatchObject({ width: 4, height: 4 });
  });
});

describe('trimming many sprites', () => {
  it('crops each sprite to its pixels', () => {
    expect(trimSprites(idsOf('a', 'b'))).toBe(true);
    expect(spriteOf('a')).toMatchObject({ width: 2, height: 1 });
    expect(spriteOf('b')).toMatchObject({ width: 1, height: 1 });
    expect(pixelsOf('a')).toEqual([1, 1]);
    stepHistory('undo');
    expect(spriteOf('a')).toMatchObject({ width: 4, height: 4 });
  });

  it('does nothing for an empty list', () => {
    expect(trimSprites([])).toBe(false);
  });
});
