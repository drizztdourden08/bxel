/* @layer core @kind logic */
import type { IndexBuffer, RgbaImage } from './image.type';
import { mapWithPlan } from './map-with-plan';
import type { MapOptions } from './palette-map.type';

const mapToPalette = (image: RgbaImage, options: MapOptions): IndexBuffer =>
  mapWithPlan(image, options, null);

export { mapToPalette };
