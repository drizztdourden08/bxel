/* @layer core @kind logic */
const cellMaskRuns = (mask: Uint8Array, columns: number): [number, number, number][] => {
  const runs: [number, number, number][] = [];
  let open: [number, number, number] | null = null;
  mask.forEach((bit, index) => {
    const x = index % columns;
    const y = (index - x) / columns;
    if (bit === 1 && open && open[0] === y && open[2] === x - 1) open[2] = x;
    else if (bit === 1) {
      open = [y, x, x];
      runs.push(open);
    }
  });
  return runs;
};

export { cellMaskRuns };
