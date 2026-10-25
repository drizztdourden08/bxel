/* @layer core @kind config */
const SHORT_RUN = 16;

const SIDE_STEPS: readonly (readonly [number, number])[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const CORNER_STEPS: readonly (readonly [number, number])[] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

export { CORNER_STEPS, SHORT_RUN, SIDE_STEPS };
