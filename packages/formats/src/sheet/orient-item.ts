/* @layer core @kind logic */
import type { Fits } from './orient-item.type';
import type { Oriented, PackItem, RotateMode } from './sheet.type';

const orientItem = (item: PackItem, mode: RotateMode, fits: Fits): Oriented => {
  const plain = { width: item.width, height: item.height, rotated: false };
  const turned = { width: item.height, height: item.width, rotated: true };
  if (mode === 'none') return plain;
  if (mode === 'fit') return fits(plain) || !fits(turned) ? plain : turned;
  return item.height > item.width && fits(turned) ? turned : plain;
};

export { orientItem };
