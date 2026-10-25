/* @layer tests @kind test */
import { frameToRgba, patchFrameRgba } from '@bxel/document';
import type { Cel, Rect, Sprite } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { benchArtwork } from './bench-artwork';

const SIDE = 48;

const fixture = () => {
  const { artwork } = benchArtwork([{ index: 1, side: SIDE, layers: 3, frames: 2 }]);
  const sprite = artwork.sprites[0];
  const bank = artwork.banks[0];
  const frame = sprite?.frames[0];
  if (!sprite || !bank || !frame) throw new Error('the fixture is incomplete');
  return { sprite, bank, frameId: frame.id };
};

const edited = (sprite: Sprite, row: number, frameId: string, change: (pixels: Uint8Array) => void): Sprite => {
  const layer = sprite.layers[row];
  const celId = layer?.cels[frameId as keyof typeof layer.cels];
  const cel: Cel | undefined = celId === undefined ? undefined : sprite.cels[celId];
  if (!layer || !cel) throw new Error('the layer has no cel');
  const pixels = cel.pixels.slice();
  change(pixels);
  return { ...sprite, cels: { ...sprite.cels, [cel.id]: { ...cel, pixels } } };
};

const bump = (pixels: Uint8Array, at: number): void => {
  pixels[at] = ((pixels[at] ?? 0) % 7) + 1;
};

const bumpAll = (pixels: Uint8Array): void => {
  for (let at = 0; at < pixels.length; at += 1) bump(pixels, at);
};

const whole: Rect = { x: 0, y: 0, width: SIDE, height: SIDE };

describe('patching a rendered frame', () => {
  it('equals a full render after a cel changed inside the rectangle', () => {
    const { sprite, bank, frameId } = fixture();
    const before = frameToRgba(sprite, bank, frameId);
    const next = edited(sprite, 2, frameId, (pixels) => {
      for (let at = 10 * SIDE + 8; at < 10 * SIDE + 20; at += 1) bump(pixels, at);
    });
    const rect: Rect = { x: 6, y: 9, width: 20, height: 3 };
    const changed = patchFrameRgba(next, bank, frameId, { rgba: before, rect });
    expect(before).toEqual(frameToRgba(next, bank, frameId));
    expect(changed).not.toBeNull();
    expect(changed?.y).toBeGreaterThanOrEqual(9);
  });

  it('reports exactly the bounds of the pixels that changed', () => {
    const { sprite, bank, frameId } = fixture();
    const before = frameToRgba(sprite, bank, frameId);
    const next = edited(sprite, 2, frameId, (pixels) => {
      bump(pixels, 20 * SIDE + 5);
      bump(pixels, 24 * SIDE + 11);
    });
    const once = patchFrameRgba(next, bank, frameId, { rgba: before, rect: whole });
    expect(once).toEqual({ x: 5, y: 20, width: 7, height: 5 });
    expect(patchFrameRgba(next, bank, frameId, { rgba: before, rect: whole })).toBeNull();
  });

  it('leaves everything outside the rectangle as it was', () => {
    const { sprite, bank, frameId } = fixture();
    const before = frameToRgba(sprite, bank, frameId);
    const next = edited(sprite, 2, frameId, bumpAll);
    const rect: Rect = { x: 4, y: 4, width: 4, height: 4 };
    patchFrameRgba(next, bank, frameId, { rgba: before, rect });
    const full = frameToRgba(next, bank, frameId);
    const stale = frameToRgba(sprite, bank, frameId);
    for (let at = 0; at < SIDE * SIDE; at += 1) {
      const x = at % SIDE;
      const y = Math.floor(at / SIDE);
      const inside = x >= 4 && x < 8 && y >= 4 && y < 8;
      const source = inside ? full : stale;
      expect(before.subarray(at * 4, at * 4 + 4)).toEqual(source.subarray(at * 4, at * 4 + 4));
    }
  });

  it('clips a rectangle that sticks out and honours hidden layers', () => {
    const { sprite, bank, frameId } = fixture();
    const hidden = { ...sprite, layers: sprite.layers.map((layer, row) => (row === 2 ? { ...layer, visible: false } : layer)) };
    const before = frameToRgba(sprite, bank, frameId);
    patchFrameRgba(hidden, bank, frameId, { rgba: before, rect: { x: -5, y: -5, width: SIDE + 20, height: SIDE + 20 } });
    expect(before).toEqual(frameToRgba(hidden, bank, frameId));
  });
});
