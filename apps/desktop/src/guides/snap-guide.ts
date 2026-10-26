/* @layer renderer-app @kind logic */
const snapGuide = (pixel: number, length: number, whole: boolean): number => {
  const snapped = whole ? Math.round(pixel) : Math.round(pixel * 2) / 2;
  return Math.min(length, Math.max(0, snapped));
};

export { snapGuide };
