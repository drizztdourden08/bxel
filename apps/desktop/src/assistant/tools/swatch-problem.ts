/* @layer renderer-app @kind logic */
import type { ChangeKind } from '../../palette-change/palette-change.type';

const swatchProblem = (kind: ChangeKind, swatch: number, other: number | null, size: number): string | null => {
  if (kind !== 'limit' && (swatch <= 0 || swatch >= size)) return `Swatch ${swatch} cannot be changed. Slot 0 is fixed and the palette has ${size} colours.`;
  if (other !== null && (other < 0 || other >= size || other === swatch)) return `Swatch ${other} is not a colour to merge into.`;
  return null;
};

export { swatchProblem };
