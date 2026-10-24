/* @layer renderer-app @kind logic */
import { opaqueSlots } from '../palette-limit/opaque-slots';
import { alphaThreshold } from './alpha-threshold';
import { colorCount } from './color-count';
import type { ImportContext, ImportForm, ReduceMode, SourceImage } from './image-import.type';

const defaultReduce = (form: ImportForm, image: SourceImage, context: ImportContext): ReduceMode | null => {
  if (form.target === 'file') return context.bank ? 'map' : null;
  const count = colorCount(image, alphaThreshold(form.alphaPercent));
  return count > opaqueSlots(form.limit, form.transparent) ? null : 'extract';
};

export { defaultReduce };
