/* @layer renderer-app @kind logic */
import { composeAnimationFrame, findBank, paletteRgba, TRANSPARENT_INDEX } from '@bxel/document';
import type { Animation, Artwork } from '@bxel/document';
import { encodePngRgba, thumbnailRgba } from '@bxel/formats';

const animationPreview = (artwork: Artwork, animation: Animation | undefined): Uint8Array | null => {
  const first = animation?.frames[0];
  const bank = animation ? findBank(artwork, animation.bankId) : undefined;
  if (!animation || !first || !bank) return null;
  const table = paletteRgba(bank);
  const indices = composeAnimationFrame(artwork, animation, first.id);
  const data = new Uint8ClampedArray(indices.length * 4);
  for (const [position, index] of indices.entries()) {
    if (index !== TRANSPARENT_INDEX) data.set(table.subarray(index * 4, index * 4 + 4), position * 4);
  }
  const encoded = encodePngRgba(thumbnailRgba({ data, width: animation.width, height: animation.height }));
  return encoded.ok ? encoded.bytes : null;
};

export { animationPreview };
