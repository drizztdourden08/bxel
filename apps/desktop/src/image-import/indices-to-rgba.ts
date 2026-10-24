/* @layer renderer-app @kind logic */
import { parseHex } from '@bxel/palette';
import { BYTE_MAX, RGBA_BYTES, SHIFT } from './image-import.constants';
import type { ReductionPlan } from './image-import.type';
import { paintIndices } from './paint-indices';

const slotTable = (plan: ReductionPlan): Uint8ClampedArray => {
  const table = new Uint8ClampedArray(plan.palette.length * RGBA_BYTES);
  for (const [slot, hex] of plan.palette.entries()) {
    const rgb = parseHex(hex) ?? 0;
    const clear = plan.transparent && slot === 0;
    const bytes = [(rgb >> SHIFT.red) & BYTE_MAX, (rgb >> SHIFT.green) & BYTE_MAX, rgb & BYTE_MAX, clear ? 0 : BYTE_MAX];
    table.set(bytes, slot * RGBA_BYTES);
  }
  return table;
};

const indicesToRgba = (pixels: Uint8Array, plan: ReductionPlan): Uint8ClampedArray => paintIndices(pixels, slotTable(plan));

export { indicesToRgba };
