/* @layer renderer-app @kind constants */
const CLEAN_RATIOS: readonly (readonly [number, number])[] = [
  [1, 0],
  [0, 1],
  [1, 1],
  [2, 1],
  [1, 2],
  [3, 1],
  [1, 3],
  [4, 1],
  [1, 4],
];

const SIGNS: readonly (readonly [number, number])[] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

export { CLEAN_RATIOS, SIGNS };
