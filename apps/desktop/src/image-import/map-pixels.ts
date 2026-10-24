/* @layer renderer-app @kind logic */
import { ditherToPalette, mapToPalette } from '@bxel/palette';
import { DITHER_SIZE } from './image-import.constants';
import type { DitherName, ReductionPlan, SourceImage } from './image-import.type';

const mapPixels = (image: SourceImage, plan: ReductionPlan, dither: DitherName, threshold: number): Uint8Array => {
  const base = { palette: plan.palette, transparent: plan.transparent, alphaThreshold: threshold };
  const size = DITHER_SIZE[dither];
  if (size === null) return mapToPalette(image, base).pixels;
  return ditherToPalette(image, { ...base, size, originX: 0, originY: 0 }).pixels;
};

export { mapPixels };
