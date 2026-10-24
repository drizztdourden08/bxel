/* @layer core @kind logic */
import { readIntegers } from './read-integers';
import type { SheetPivot } from './sheet-metadata.type';

const readJsonPivot = (value: unknown): SheetPivot | undefined => {
  const numbers = readIntegers(value, ['x2', 'y2']);
  if (!numbers) return undefined;
  const [x2 = 0, y2 = 0] = numbers;
  return { x2, y2 };
};

export { readJsonPivot };
