/* @layer renderer-app @kind logic */
const flipGrid = (grid: Uint8Array, side: number): Uint8Array =>
  Uint8Array.from(grid, (_, at) => grid[Math.floor(at / side) * side + (side - 1 - (at % side))] ?? 0);

export { flipGrid };
