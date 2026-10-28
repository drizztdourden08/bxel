/* @layer renderer-app @kind logic */
import { rampSlots } from '@bxel/raster';
import type { PaletteBank } from '@bxel/document';
import type { DrawingSettings } from '../stores/drawing-store.type';
import type { GradientEnds } from './gradient-colours.type';

const holding = (bank: PaletteBank, front: number): number[] | null => {
  for (const ramp of bank.ramps) {
    const slots = rampSlots(bank, ramp.name);
    if (slots?.includes(front)) return slots;
  }
  return null;
};

const spanOf = (slots: readonly number[], ends: GradientEnds): number[] => {
  const start = slots.indexOf(ends.front);
  const stop = slots.indexOf(ends.back);
  const last = stop >= 0 && stop !== start ? stop : slots.length - 1;
  return start <= last ? slots.slice(start, last + 1) : slots.slice(last, start + 1).reverse();
};

const gradientColours = (bank: PaletteBank, drawing: DrawingSettings, ends: GradientEnds): number[] => {
  const named = drawing.gradientRamp === null ? null : rampSlots(bank, drawing.gradientRamp);
  if (named && named.length > 1) return [...named];
  const slots = holding(bank, ends.front);
  const span = slots ? spanOf(slots, ends) : [];
  return span.length > 1 ? span : [ends.front, ends.back];
};

export { gradientColours };
