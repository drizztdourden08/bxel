/* @layer renderer-app @kind test */
import { describe, expect, it } from 'vitest';
import { keptCanvas } from '../../src/views/EntryTile/behavior/kept-canvas';
import type { KeptCanvas } from '../../src/views/EntryTile/behavior/kept-canvas.type';

type FakeCanvas = { readonly width: number };

const cache = () => {
  const kept = new Map<string, KeptCanvas<FakeCanvas>>();
  const made: FakeCanvas[] = [];
  const ask = (key: string, sprite: object, bank: object | undefined, limit = 600): FakeCanvas =>
    keptCanvas({
      kept,
      key,
      sprite,
      bank,
      limit,
      make: () => {
        const canvas = { width: made.length };
        made.push(canvas);
        return canvas;
      },
    });
  return { ask, made, kept };
};

describe('S2 the entry thumbnails are kept by sprite and revision', { tags: ['standard'] }, () => {
  it('draws a sprite once and gives the same picture while the sprite and bank are the same', () => {
    const { ask, made } = cache();
    const hero = {};
    const bank = {};
    const first = ask('hero:32', hero, bank);
    expect(ask('hero:32', hero, bank)).toBe(first);
    expect(made).toHaveLength(1);
  });

  it('draws again when the sprite or bank changes or the size does', () => {
    const { ask, made } = cache();
    const bank = {};
    const first = ask('mage:32', {}, bank);
    expect(ask('mage:32', {}, bank)).not.toBe(first);
    ask('mage:64', {}, bank);
    ask('mage:64', {}, undefined);
    expect(made).toHaveLength(4);
  });

  it('forgets the oldest picture past the limit', () => {
    const { ask, kept } = cache();
    const sprite = {};
    ask('a', sprite, undefined, 2);
    ask('b', sprite, undefined, 2);
    ask('c', sprite, undefined, 2);
    expect([...kept.keys()]).toEqual(['b', 'c']);
  });
});
