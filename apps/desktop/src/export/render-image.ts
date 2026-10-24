/* @layer renderer-app @kind logic */
import type { Frame } from '@bxel/document';
import { upscaleRgba } from '@bxel/formats';
import type { RgbaImage } from '@bxel/formats';
import { frameImage } from '../files/frame-image';
import type { Target } from './export.type';

const renderImage = (target: Target, frame: Frame, scale: number): RgbaImage => {
  const image = frameImage(target.sprite, target.bank, frame.id);
  return scale === 1 ? image : upscaleRgba(image, scale);
};

export { renderImage };
