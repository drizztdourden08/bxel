/* @layer renderer-app @kind logic */
const snapped = (pixel: number, whole: boolean, step: number | null): number => {
  if (step !== null) return Math.round(pixel / step) * step;
  return whole ? Math.round(pixel) : Math.round(pixel * 2) / 2;
};

const snapGuide = (pixel: number, length: number, whole: boolean, step: number | null = null): number =>
  Math.min(length, Math.max(0, snapped(pixel, whole, step)));

export { snapGuide };
