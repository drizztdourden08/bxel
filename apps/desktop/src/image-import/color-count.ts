/* @layer renderer-app @kind logic */
import { countColors } from '@bxel/palette';
import { analysisImage } from './analysis-image';
import type { SourceImage } from './image-import.type';

const colorCount = (image: SourceImage, threshold: number): number => {
  const { data, width, height } = analysisImage(image);
  return countColors({ data, width, height }, { alphaThreshold: threshold }).colors.length;
};

export { colorCount };
