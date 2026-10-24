/* @layer core @kind logic */
import type { PackResult } from './sheet.type';

const smallerPack = (first: PackResult, second: PackResult): PackResult => {
  if (!first.ok) return second.ok ? second : first;
  if (!second.ok) return first;
  return second.width * second.height < first.width * first.height ? second : first;
};

export { smallerPack };
