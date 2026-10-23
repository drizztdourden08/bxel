/* @layer core @kind logic */
import type { Rgb } from '../model/palette.type';

const rgbBytes = (rgb: Rgb): readonly [number, number, number] => [
  Number.parseInt(rgb.slice(1, 3), 16),
  Number.parseInt(rgb.slice(3, 5), 16),
  Number.parseInt(rgb.slice(5, 7), 16),
];

export { rgbBytes };
