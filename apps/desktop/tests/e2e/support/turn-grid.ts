/* @layer renderer-app @kind logic */
const turnGrid = (grid: Uint8Array, side: number): Uint8Array =>
  Uint8Array.from(grid, (_, at) => grid[(side - 1 - (at % side)) * side + Math.floor(at / side)] ?? 0);

export { turnGrid };
