/* @layer core @kind logic */
const paethPredictor = (a: number, b: number, c: number): number => {
  const pa = Math.abs(b - c);
  const pb = Math.abs(a - c);
  const pc = Math.abs(a + b - 2 * c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
};

export { paethPredictor };
