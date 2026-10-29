/* @layer core @kind logic */
const globalRegion = (grid: { readonly width: number; readonly height: number }, open: (x: number, y: number) => boolean): Uint8Array => {
  const region = new Uint8Array(grid.width * grid.height);
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (open(x, y)) region[y * grid.width + x] = 1;
    }
  }
  return region;
};

export { globalRegion };
