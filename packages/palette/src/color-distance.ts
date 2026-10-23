/* @layer core @kind logic */

const colorDistance = (a: number, b: number): number => {
  const ar = (a >> 16) & 255;
  const br = (b >> 16) & 255;
  const dr = ar - br;
  const dg = ((a >> 8) & 255) - ((b >> 8) & 255);
  const db = (a & 255) - (b & 255);
  const redMean = (ar + br) >> 1;
  return (((512 + redMean) * dr * dr) >> 8) + 4 * dg * dg + (((767 - redMean) * db * db) >> 8);
};

export { colorDistance };
