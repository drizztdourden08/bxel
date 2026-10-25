/* @layer core @kind logic */
const countInto = (pixels: Uint8Array, range: { readonly from: number; readonly to: number }, totals: Int32Array, step: number): void => {
  for (let at = range.from; at < range.to; at += 1) {
    const value = pixels[at] ?? 0;
    totals[value] = (totals[value] ?? 0) + step;
  }
};

export { countInto };
