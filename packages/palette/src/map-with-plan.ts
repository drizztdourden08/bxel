/* @layer core @kind logic */
import { ALPHA_THRESHOLD_DEFAULT } from './alpha-threshold.constants';
import type { IndexBuffer, RgbaImage } from './image.type';
import { mapImage } from './map-image';
import type { DitherPlan, MapOptions } from './palette-map.type';
import { parsePalette } from './parse-palette';

const mapWithPlan = (
  image: RgbaImage,
  options: MapOptions,
  dither: DitherPlan | null,
): IndexBuffer =>
  mapImage({
    image,
    table: parsePalette(options.palette, options.transparent),
    alphaThreshold: options.alphaThreshold ?? ALPHA_THRESHOLD_DEFAULT,
    dither,
  });

export { mapWithPlan };
