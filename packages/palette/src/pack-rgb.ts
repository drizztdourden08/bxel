/* @layer core @kind logic */

const packRgb = (r: number, g: number, b: number): number => (r << 16) | (g << 8) | b;

export { packRgb };
