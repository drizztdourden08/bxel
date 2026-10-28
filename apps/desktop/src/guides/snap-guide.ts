/* @layer renderer-app @kind logic */
const snapGuide = (pixel: number, length: number, whole: boolean, step: number | null = null): number => {
  const snapped = step === null ? (whole ? Math.round(pixel) : Math.round(pixel * 2) / 2) : Math.round(pixel / step) * step;
  return Math.min(length, Math.max(0, snapped));
};

export { snapGuide };
