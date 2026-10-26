/* @layer renderer-app @kind logic */
import type { Animation, Artwork } from '@bxel/document';
import { encodePngRgba, thumbnailRgba } from '@bxel/formats';
import { composedRgba } from '../timeline/composed-rgba';

const animationPreview = (artwork: Artwork, animation: Animation | undefined): Uint8Array | null => {
  const first = animation?.frames[0];
  const data = animation && first ? composedRgba(artwork, animation, first.id) : null;
  if (!animation || !data) return null;
  const encoded = encodePngRgba(thumbnailRgba({ data, width: animation.width, height: animation.height }));
  return encoded.ok ? encoded.bytes : null;
};

export { animationPreview };
