/* @layer core @kind constants */

const GIF_INTERLACE_PASSES = [
  { start: 0, step: 8 },
  { start: 4, step: 8 },
  { start: 2, step: 4 },
  { start: 1, step: 2 },
] as const;

export { GIF_INTERLACE_PASSES };
