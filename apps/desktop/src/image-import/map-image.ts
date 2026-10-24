/* @layer renderer-app @kind logic */
import { alphaThreshold } from './alpha-threshold';
import { countChanged } from './count-changed';
import { indicesToRgba } from './indices-to-rgba';
import type { ColorsForm, MappedImage, ReductionPlan, SourceImage } from './image-import.type';
import { mapPixels } from './map-pixels';
import { usedSlots } from './used-slots';

const mapImage = (image: SourceImage, plan: ReductionPlan, form: ColorsForm): MappedImage => {
  const pixels = mapPixels(image, plan, form.dither, alphaThreshold(form.alphaPercent));
  const rgba = indicesToRgba(pixels, plan);
  return { rgba, pixels, changed: countChanged(image.data, rgba), used: usedSlots(pixels, plan.transparent) };
};

export { mapImage };
