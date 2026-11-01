/* @layer renderer-app @kind constants */
const DIGIT_WIDTH = 3;

const DIGIT_ROWS: readonly (readonly number[])[] = [
  [7, 5, 5, 5, 7],
  [2, 6, 2, 2, 7],
  [7, 1, 7, 4, 7],
  [7, 1, 7, 1, 7],
  [5, 5, 7, 1, 1],
  [7, 4, 7, 1, 7],
  [7, 4, 7, 5, 7],
  [7, 1, 1, 1, 1],
  [7, 5, 7, 5, 7],
  [7, 5, 7, 1, 7],
];

const KEY_INK: readonly [number, number, number, number] = [255, 255, 255, 255];

const KEY_SHADOW: readonly [number, number, number, number] = [0, 0, 0, 255];

export { DIGIT_ROWS, DIGIT_WIDTH, KEY_INK, KEY_SHADOW };
