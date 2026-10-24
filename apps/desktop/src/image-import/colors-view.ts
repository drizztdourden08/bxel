/* @layer renderer-app @kind logic */
import { opaqueSlots } from '../palette-limit/opaque-slots';
import { alphaThreshold } from './alpha-threshold';
import { colorCount } from './color-count';
import { IMPORT_TEXT } from './image-import.constants';
import type { ColorsView, ImportContext, ColorsForm, SourceImage } from './image-import.type';
import { mapImage } from './map-image';
import { reductionPlan } from './reduction-plan';

const colorsView = (form: ColorsForm, image: SourceImage, context: ImportContext): ColorsView => {
  const count = colorCount(image, alphaThreshold(form.alphaPercent));
  const plan = reductionPlan(form, image, context.bank);
  const limit = plan?.limit ?? form.limit;
  const transparent = plan?.transparent ?? form.transparent;
  const opaque = opaqueSlots(limit, transparent);
  const unreduced = form.reduce === null && count > opaque;
  return {
    count,
    plan,
    mapped: plan ? mapImage(image, plan, form) : null,
    limit,
    transparent,
    opaque,
    warning: unreduced ? IMPORT_TEXT.tooMany(count, limit) : null,
  };
};

export { colorsView };
