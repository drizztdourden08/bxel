/* @layer renderer-app @kind logic */
import type { PaletteBank } from '@bxel/document';
import type { SourceImage } from '../image-import/image-import.type';
import { mapImage } from '../image-import/map-image';
import { reductionPlan } from '../image-import/reduction-plan';
import { EXACT } from './fit-image.constants';
import { DROP_TEXT } from './image-drop.constants';
import type { FitResult } from './image-drop.type';

const fitImage = (image: SourceImage, bank: PaletteBank | undefined): FitResult => {
  const plan = bank ? reductionPlan(EXACT, image, bank) : null;
  if (!plan) return { ok: false, reason: DROP_TEXT.noBank };
  const mapped = mapImage(image, plan, EXACT);
  return mapped.changed === 0 ? { ok: true, pixels: mapped.pixels } : { ok: false, reason: DROP_TEXT.colours(mapped.changed) };
};

export { fitImage };
