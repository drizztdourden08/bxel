/* @layer core @kind logic */
import type { PaletteBank } from '@bxel/document';
import { rampSlots } from '../shade/ramp-slots';
import { shadeTable } from '../shade/shade-table';
import { autoTable } from './auto-table';
import type { Ink } from './ink.type';

const inkTable = (bank: PaletteBank, ink: Ink | undefined): Uint8Array | null => {
  if (!ink) return null;
  if (ink.kind === 'lighten') return autoTable(bank, 'up', ink.steps);
  if (ink.kind === 'darken') return autoTable(bank, 'down', ink.steps);
  if (ink.kind !== 'shade') return null;
  if (ink.ramp === undefined) return autoTable(bank, ink.direction, ink.steps);
  const slots = rampSlots(bank, ink.ramp);
  return slots ? shadeTable({ slots, direction: ink.direction, steps: ink.steps }) : null;
};

export { inkTable };
