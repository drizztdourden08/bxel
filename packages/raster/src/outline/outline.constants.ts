/* @layer core @kind config */
const RING_4: readonly (readonly [number, number])[] = [[0, -1], [-1, 0], [1, 0], [0, 1]];
const RING_8: readonly (readonly [number, number])[] = [...RING_4, [-1, -1], [1, -1], [-1, 1], [1, 1]];

export { RING_4, RING_8 };
