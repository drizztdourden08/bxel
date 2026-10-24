/* @layer renderer-app @kind logic */
import { flattenFrame } from '@bxel/document';
import type { Frame } from '@bxel/document';
import { upscaleIndexed } from '@bxel/formats';
import type { IndexedImage } from '@bxel/formats';
import { bankRgba } from './bank-rgba';
import type { Target } from './export.type';

const frameIndices = (target: Target, frame: Frame, scale: number): IndexedImage => {
  const { sprite, bank } = target;
  const image = {
    indices: flattenFrame(sprite, frame.id),
    palette: bankRgba(bank),
    width: sprite.width,
    height: sprite.height,
  };
  return scale === 1 ? image : upscaleIndexed(image, scale);
};

export { frameIndices };
