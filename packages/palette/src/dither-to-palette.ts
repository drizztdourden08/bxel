/* @layer core @kind logic */
import { buildDitherPlan } from './dither-plan';
import type { IndexBuffer, RgbaImage } from './image.type';
import { mapWithPlan } from './map-with-plan';
import type { DitherOptions } from './palette-map.type';

const ditherToPalette = (image: RgbaImage, options: DitherOptions): IndexBuffer =>
  mapWithPlan(image, options, buildDitherPlan(options));

export { ditherToPalette };
