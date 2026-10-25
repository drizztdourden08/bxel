/* @layer renderer-app @kind logic */
import { decodeApng, decodeGif, decodePng } from '@bxel/formats';
import { animationSource } from './animation-source';
import type { DecodedSource } from './image-import.type';
import { isAnimatedPng } from './is-animated-png';
import { isGifBytes } from './is-gif-bytes';

const stillSource = (bytes: Uint8Array): DecodedSource | null => {
  const decoded = decodePng(bytes);
  return decoded.ok ? { width: decoded.width, height: decoded.height, data: decoded.data } : null;
};

const decodeSource = (bytes: Uint8Array): DecodedSource | null => {
  if (isGifBytes(bytes)) return animationSource(decodeGif(bytes));
  if (!isAnimatedPng(bytes)) return stillSource(bytes);
  return animationSource(decodeApng(bytes)) ?? stillSource(bytes);
};

export { decodeSource };
