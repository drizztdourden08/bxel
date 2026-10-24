/* @layer renderer-app @kind logic */
import { countColors } from '@bxel/palette';
import type { SourceImage } from './image-import.type';

const colorCount = (image: SourceImage, threshold: number): number =>
  countColors({ data: image.data, width: image.width, height: image.height }, { alphaThreshold: threshold }).colors.length;

export { colorCount };
