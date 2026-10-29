/* @layer core @kind constants */
const STEPS_4: readonly (readonly [number, number])[] = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const STEPS_8: readonly (readonly [number, number])[] = [...STEPS_4, [1, 1], [1, -1], [-1, 1], [-1, -1]];

export { STEPS_4, STEPS_8 };
