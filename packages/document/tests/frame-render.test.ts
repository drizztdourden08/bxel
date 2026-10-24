/* @layer tests @kind test */
import { flattenFrame, frameToRgba } from '@bxel/document';
import type { Sprite } from '@bxel/document';
import { describe, expect, it } from 'vitest';
import { benchArtwork } from './bench-artwork';

const SIDE = 37;
const LAYERS = 4;
const HIDDEN = 2;

const fixture = () => {
  const state = benchArtwork([{ index: 1, side: SIDE, layers: LAYERS, frames: 2 }]);
  const sprite = state.artwork.sprites[0];
  const bank = state.artwork.banks[0];
  const frame = sprite?.frames[0];
  if (!sprite || !bank || !frame) throw new Error('the fixture is incomplete');
  const hidden: Sprite = { ...sprite, layers: sprite.layers.map((layer, at) => (at === HIDDEN ? { ...layer, visible: false } : layer)) };
  return { sprite: hidden, bank, frameId: frame.id };
};

const naiveFlatten = (sprite: Sprite, frameId: string): number[] => {
  const out = new Array<number>(sprite.width * sprite.height).fill(0);
  for (const layer of sprite.layers) {
    const celId = layer.cels[frameId as keyof typeof layer.cels];
    const pixels = layer.visible && celId ? sprite.cels[celId]?.pixels : undefined;
    pixels?.forEach((value, at) => {
      if (value !== 0) out[at] = value;
    });
  }
  return out;
};

describe('frame rendering', () => {
  it('flattens visible layers bottom to top with zero as see through', () => {
    const { sprite, frameId } = fixture();
    expect(Array.from(flattenFrame(sprite, frameId))).toEqual(naiveFlatten(sprite, frameId));
  });

  it('turns every index into the bank colour and unknown indices into nothing', () => {
    const { sprite, bank, frameId } = fixture();
    const rgba = frameToRgba(sprite, bank, frameId);
    const flat = naiveFlatten(sprite, frameId);
    expect(rgba).toHaveLength(flat.length * 4);
    for (const [at, index] of flat.entries()) {
      const slot = bank.slots[index];
      const want = !slot || slot.kind === 'transparent' ? [0, 0, 0, 0] : [...[1, 3, 5].map((from) => Number.parseInt(slot.rgb.slice(from, from + 2), 16)), 255];
      expect(Array.from(rgba.subarray(at * 4, at * 4 + 4))).toEqual(want);
    }
  });
});
